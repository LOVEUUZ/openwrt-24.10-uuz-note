include $(TOPDIR)/rules.mk

#名称 myubus
PKG_NAME:=myubus
PKG_VERSION:=1.0
PKG_RELEASE:=1

# define Package/myubus
# 声明一个包的元信息结构
# 名字必须和 PKG_NAME 一致
# 这个名字会成为：menuconfig 显示项，ipk 包名

# SECTION:=utils
# 这是 逻辑分类字段
# 常见值：base net utils admin 影响较小，更多是归档分类。

# CATEGORY:=Utilities
# menuconfig首菜单的大类别

# DEPENDS:=+libubus +libubox
# 依赖说明：表示运行时依赖
# 会自动加入 ipk control Depends
# 编译时自动确保 staging_dir 里存在对应库
# 如果写：DEPENDS:=+libubus, 编译时：会先编译 libubus
# 安装 ipk 时会自动安装 libubus

define Package/myubus
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Simple ubus example
  DEPENDS:=+libubus +libubox
endef

#描述
define Package/myubus/description
 A simple ubus demo service.
endef


# 手动开启或关闭编译进dbg信息
DEBUG_enable := 1

ifeq ($(DEBUG_enable),1)
    $(info >>> MYUBUS DEBUG MODE <<<)
    TARGET_CFLAGS := $(filter-out -Os,$(TARGET_CFLAGS))
    TARGET_CFLAGS += -O0 -g3 -fno-omit-frame-pointer
endif

include $(INCLUDE_DIR)/package.mk


#在 build_dir 里创建一个临时编译目录，把源码复制进去
#好处：build_dir 可以被自动清理，支持并行编译，不污染源码目录
define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
	$(CP) ./include $(PKG_BUILD_DIR)/
endef

# 编译工具栏和内容
define Build/Compile
	$(TARGET_CC) \
		$(TARGET_CFLAGS) \
		-I$(PKG_BUILD_DIR) \
		-I$(PKG_BUILD_DIR)/include \
		-o $(PKG_BUILD_DIR)/myubus \
		$(PKG_BUILD_DIR)/myubus.c \
		$(PKG_BUILD_DIR)/myubus_dbg_test.c \
		-lubus -lubox
endef

#安装，把编译好的文件放到“假 rootfs 目录”里，OpenWrt 会把这个目录打包成 ipk。
define Package/myubus/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/myubus $(1)/usr/sbin/

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/myubus.init $(1)/etc/init.d/myubus
endef

$(eval $(call BuildPackage,myubus))