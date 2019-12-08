import React, { Suspense } from "react";
import { Icon, Table } from "semantic-ui-react";

const Loading = () => {
  return (
    <div>
      <h1>LOADING....</h1>
    </div>
  );
};

const renderAccount = user => {
  // const output = ;

  return (
    <div>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Git Repository</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
              <Icon name="folder" /> node_modules
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell collapsing textAlign="right">
              10 hours ago
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name="folder" /> test
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name="folder" /> build
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name="file outline" /> package.json
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Icon name="file outline" /> Gruntfile.js
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      {Object.entries(user).map(key => {
        console.log(key);
        return <div key={key}>{key[0].toString()}</div>;
      })}
    </div>
  );
};

const Account = props => {
  const { user, userRef } = props;

  return (
    <div>
      <Suspense fallback={<Loading />}>{renderAccount(user)}</Suspense>
    </div>
  );
};

export default Account;
