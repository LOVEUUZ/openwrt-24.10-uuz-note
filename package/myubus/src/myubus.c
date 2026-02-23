/*
 * ============================================================
 *  自定义 ubus 服务示例（教学完整版）
 *
 *  功能：
 *    1. info        - 无参数方法
 *    2. par.test    - 手动遍历参数
 *    3. par2        - 使用 policy 结构化解析参数（推荐方式）
 *
 *  依赖：
 *      libubus
 *      libubox
 * ============================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <libubus.h>
#include <libubox/blobmsg_json.h>
#include <libubox/uloop.h>

/* ubus 上下文指针 */
static struct ubus_context *ctx;

/* 全局 blob buffer
 * 所有 reply 都写入这里
 * 每次使用前必须 blob_buf_init()
 */
static struct blob_buf b;

/*
 * ubus 方法回调函数固定签名说明：
 *
 * ctx     : 当前 ubus 连接上下文（通信通道）
 * obj     : 当前被调用的 ubus 对象
 * req     : 本次请求的上下文（用于回复）
 * method  : 被调用的方法名
 * msg     : 客户端传入的参数（blob 格式）
 */


/* ============================================================
 *  方法 1：无参数示例
 * ============================================================
 *  UBUS_METHOD_NOARG 注册方式
 *  msg 永远为 NULL
 *
    ubus call myubus info
    {
        "msg": "hello ubus",
        "number": 100
    }

 */
static int my_info(struct ubus_context *ctx,
    struct ubus_object *obj,
    struct ubus_request_data *req,
    const char *method,
    struct blob_attr *msg) {
    
    /* 初始化返回 buffer（必须） */
    blob_buf_init(&b, 0);

    /* 添加字段 */
    blobmsg_add_string(&b, "msg", "hello ubus");
    blobmsg_add_u32(&b, "number", 100);

    /* 发送 reply */
    ubus_send_reply(ctx, req, b.head);

    return 0;
}


/* ============================================================
 *  方法 2：手动遍历参数（不推荐生产使用）
 * ============================================================
 *  特点：
 *      - 可接受任意 JSON
 *      - 不校验字段
 *      - 不校验类型

   ubus call myubus par.test '{"a":1,"b":"test"}'
    {
        "code": 0,
        "data": {
            "echo": {
                "a": 1,
                "b": "test"
            }
        }
    }
 */

 /* 可选 policy（这里只是示例，不起限制作用） */
static const struct blobmsg_policy par_policy[] = {
    {.name = "data", .type = BLOBMSG_TYPE_UNSPEC },
};

static int my_info_par(struct ubus_context *ctx,
    struct ubus_object *obj,
    struct ubus_request_data *req,
    const char *method,
    struct blob_attr *msg) {
    
    struct blob_attr *attr;
    int rem;

    blob_buf_init(&b, 0);

    blobmsg_add_u32(&b, "code", 0);

    /* 打开嵌套 table
     * JSON 结构：
     * {
     *   "code":0,
     *   "data":{
     *       "echo":{...}
     *   }
     * }
     */
    void *tbl1 = blobmsg_open_table(&b, "data");
    void *tbl2 = blobmsg_open_table(&b, "echo");

    if (msg) {

        /* 遍历 JSON 所有字段 */
        blobmsg_for_each_attr(attr, msg, rem) {

            const char *name = blobmsg_name(attr);
            int type = blobmsg_type(attr);

            printf("Key: %s, Type: %d, Value: ", name, type);

            switch (type) {

            case BLOBMSG_TYPE_STRING:
                printf("%s\n", blobmsg_get_string(attr));
                blobmsg_add_string(&b, name, blobmsg_get_string(attr));
                break;

            case BLOBMSG_TYPE_INT32:
                printf("%d\n", blobmsg_get_u32(attr));
                blobmsg_add_u32(&b, name, blobmsg_get_u32(attr));
                break;

            case BLOBMSG_TYPE_INT64:
                printf("%lld\n", (long long)blobmsg_get_u64(attr));
                blobmsg_add_u64(&b, name,blobmsg_get_u64(attr));
                break;

            case BLOBMSG_TYPE_BOOL:
                printf("%s\n", blobmsg_get_bool(attr) ? "true" : "false");
                blobmsg_add_u8(&b, name, blobmsg_get_bool(attr));
                break;

            default:
                printf("Unsupported type\n");
                break;
            }
        }
    }

    /* 关闭顺序必须后开先关（栈结构） */
    blobmsg_close_table(&b, tbl2);
    blobmsg_close_table(&b, tbl1);

    ubus_send_reply(ctx, req, b.head);
    return 0;
}


/* ============================================================
 *  方法 3：使用 policy 解析（推荐方式）
 * ============================================================
 *  优势：
 *      - 自动字段匹配
 *      - 自动类型检查
 *      - 可控、安全
 *      - 易维护
 *
    ubus call myubus par2 '{"name":"uuz","age":18}'
    {
            "code": 0,
            "data": {
                    "name": "uuz",
                    "age": 18
            }
    }
 */

 /* 定义字段索引 */
enum {
    PAR2_NAME,
    PAR2_AGE,
    __PAR2_MAX,
};

/* 定义 policy 规则 */
static const struct blobmsg_policy par2_policy[__PAR2_MAX] = {
    [PAR2_NAME] = {.name = "name", .type = BLOBMSG_TYPE_STRING },
    [PAR2_AGE] = {.name = "age",  .type = BLOBMSG_TYPE_INT32  },
};

static int my_info_par2(struct ubus_context *ctx,
    struct ubus_object *obj,
    struct ubus_request_data *req,
    const char *method,
    struct blob_attr *msg) {
    
    struct blob_attr *tb[__PAR2_MAX];

    blob_buf_init(&b, 0);
    blobmsg_add_u32(&b, "code", 0);

    if (!msg) {
        blobmsg_add_string(&b, "error", "no input");
        ubus_send_reply(ctx, req, b.head);
        return 0;
    }

    /*
     * 解析步骤：
     *
     * 1. 根据 policy 表匹配字段
     * 2. 类型不匹配自动丢弃
     * 3. 成功字段放入 tb[]
     */
    blobmsg_parse(par2_policy,
        __PAR2_MAX,
        tb,
        blob_data(msg),
        blob_len(msg));

    void *tbl = blobmsg_open_table(&b, "data");

    if (tb[PAR2_NAME]) {
        const char *name = blobmsg_get_string(tb[PAR2_NAME]);
        printf("name = %s\n", name);
        blobmsg_add_string(&b, "name", name);
    }

    if (tb[PAR2_AGE]) {
        int age = blobmsg_get_u32(tb[PAR2_AGE]);
        printf("age = %d\n", age);
        blobmsg_add_u32(&b, "age", age);
    }

    blobmsg_close_table(&b, tbl);

    ubus_send_reply(ctx, req, b.head);
    return 0;
}


/* ============================================================
 *  注册方法
 * ============================================================
 */
static const struct ubus_method my_methods[] = {
    UBUS_METHOD_NOARG("info", my_info),
    UBUS_METHOD("par.test", my_info_par, par_policy),
    UBUS_METHOD("par2", my_info_par2, par2_policy),
};


/* 定义对象类型 */
static struct ubus_object_type my_object_type =
UBUS_OBJECT_TYPE("myubus", my_methods);


/* 定义对象 */
static struct ubus_object my_object = {
    .name = "myubus",
    .type = &my_object_type,
    .methods = my_methods,
    .n_methods = ARRAY_SIZE(my_methods),
};



int main(int argc, char **argv) {
    /* 1️⃣ 初始化事件循环
     * ubus 是基于事件驱动的，必须先初始化 uloop
     * 否则无法处理任何请求
     */
    uloop_init();

    /* 2️⃣ 连接 ubusd（IPC 中枢）
     * NULL 表示使用默认 socket:
     * /var/run/ubus/ubus.sock
     *
     * ⚠ 重点：
     * 如果这里失败：
     *   - 检查 ubusd 是否运行
     *   - 检查权限
     */
    ctx = ubus_connect(NULL);
    if (!ctx) {
        fprintf(stderr, "Failed to connect to ubus\n");
        return -1;
    }

    /* 3️⃣ 把 ubus 的 socket 注册到事件循环
     *
     * ⚠ 重点：
     * 如果忘记调用这一行，
     * ubus call 能发送，但服务端不会响应。
     */
    ubus_add_uloop(ctx);

    /* 4️⃣ 向 ubusd 注册 object（对外暴露接口）
     *
     * 成功后才能通过：
     * ubus call myubus xxx
     *
     * ⚠ 重点：
     * object 名字不能重复
     */
    if (ubus_add_object(ctx, &my_object)) {
        fprintf(stderr, "Failed to add object\n");
        return -1;
    }

    /* 5️⃣ 进入事件循环（阻塞）
     *
     * 所有 ubus 方法调用都在这里被触发
     *
     * ⚠ 重点：
     * 没有 uloop_run()，程序会立即退出
     */
    uloop_run();

    /* 6️⃣ 释放资源（正常退出时执行） */
    ubus_free(ctx);
    uloop_done();

    return 0;
}


/*
============================================================
                📘 ubus CLI 常用命令笔记
============================================================

2️⃣ 查看对象方法
    ubus -v list myubus

    'myubus' @4d9b654e
            "info":{}
            "par.test":{"data":"(unknown)"}
            "par2":{"name":"String","age":"Integer"}

3️⃣ 调用无参数方法
    ubus call myubus info

4️⃣ 调用手动遍历方法
    ubus call myubus par.test '{"a":1,"b":"test"}'

5️⃣ 调用 policy 方法
    ubus call myubus par2 '{"name":"uuz","age":18}'

6️⃣ 空参数调用
    ubus call myubus par2 '{}'

7️⃣ 注意：
    ubus call <object> <method> '<JSON>'
    JSON 必须合法
    字符串必须带双引号

============================================================
*/