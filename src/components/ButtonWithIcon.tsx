import Button, { ButtonTypeMap } from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";

export default class ButtonWithIcon extends React.PureComponent<
  ButtonTypeMap<{
    label: string;
    icon: string;
    onClick?: React.MouseEventHandler;
    className?: string;
    iconClassName?: string;
  }>["props"]
> {
  render() {
    const {
      label,
      icon,
      onClick,
      disabled,
      className,
      iconClassName,
      ...buttonProps
    } = this.props;
    return (
      <Button
        className={className}
        onClick={onClick}
        disabled={disabled}
        {...buttonProps}
      >
        {label}
        <Icon className={iconClassName}>{icon}</Icon>
      </Button>
    );
  }
}
