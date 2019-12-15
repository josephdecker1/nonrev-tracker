import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { css } from "@emotion/core";

export const MapAction = props => {
  const { app, action, actionText, actionIcon, color } = props;

  let to = null;
  action ? (to = `${app}?action=${action}`) : (to = `${app}`);
  return (
    <div
      css={css`
        margin: 2px;
      `}
    >
      <Link to={to}>
        <Button color={color}>
          <Icon name={actionIcon} />
          {actionText}
        </Button>
      </Link>
    </div>
  );
};
