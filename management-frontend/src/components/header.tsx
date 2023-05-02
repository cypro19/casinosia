import React from "react";
import { useGetLocale, useSetLocale } from "@pankod/refine-core";
import {
  AntdLayout,
  Space,
  Menu,
  Button,
  Icons,
  Dropdown,
  Avatar,
} from "@pankod/refine-antd";
import { useTranslation } from "react-i18next";
import { useTranslate } from "@pankod/refine-core";
import { ButtonGroup, IconButton } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const { DownOutlined } = Icons;

export const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();

  const currentLocale = locale();
  const translate = useTranslate();

  const menu = (
    <Menu selectedKeys={currentLocale ? [currentLocale] : []}>
      {[...(i18n.languages || [])].sort().map((lang: string) => (
        <Menu.Item
          key={lang}
          onClick={() => changeLanguage(lang)}
          icon={
            <span style={{ marginRight: 8 }}>
              <Avatar size={16} src={`/images/flags/${lang}.svg`} />
            </span>
          }
        >
          {lang === "en"
            ? translate("language.en.full")
            : translate("language.de.full")}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AntdLayout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0rem 1.5rem",
        height: "3rem",
        backgroundColor: "#FFF",
      }}
    >
      <ButtonGroup>
        <IconButton>
          <PersonOutlineOutlinedIcon />
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
      </ButtonGroup>
      <Dropdown overlay={menu}>
        <Button type="link">
          <Space>
            <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
            {currentLocale === "en"
              ? translate("language.en.short")
              : translate("language.de.full")}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </AntdLayout.Header>
  );
};
