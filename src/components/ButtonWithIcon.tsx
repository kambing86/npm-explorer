import Button, { ButtonTypeMap } from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { MouseEventHandler, PureComponent } from "react";

export default class ButtonWithIcon extends PureComponent<
  ButtonTypeMap<{
    label: string;
    icon: string;
    onClick?: MouseEventHandler;
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
        sx={{ marginTop: 1 }}
        className={className}
        onClick={onClick}
        disabled={disabled}
        endIcon={<Icon className={iconClassName}>{icon}</Icon>}
        {...buttonProps}
      >
        {label}
      </Button>
    );
  }
}
