#
# Copyright (C) 2008-2014 The LuCI Team <luci@lists.subsignal.org>
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Test Page
LUCI_DEPENDS:=+luci-base
PKG_LICENSE:=Apache-2.0

# 额外要固化的文件(自动寻找路径然后拷贝到$(1)/etc/config/myapp)
LUCI_EXTRA_FILES:=root/etc/config/myapp

#这里使用LUCI_EXTRA_FILES是因为避免覆盖rules中的install对前端相关文件的行为
#如果要固化配置文件,而且没有使用 rules.mk 的话，就需要自己写如下内容: 

# define Package/luci-mod-test/install
# 	$(call Package/luci-mod-test/install/default,$(1))

# 	$(INSTALL_DIR) $(1)/etc/config
# 	$(INSTALL_CONF) ./root/etc/config/myapp $(1)/etc/config/myapp
# endef

include $(TOPDIR)/feeds/luci/luci.mk


# call BuildPackage - OpenWrt buildroot signature

