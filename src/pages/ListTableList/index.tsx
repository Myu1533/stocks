import { Drawer } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { TableListItem } from './data.d';
import { queryRule } from './service';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '股票代码',
      dataIndex: 'key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '目标价格',
      dataIndex: 'desc',
      valueType: 'textarea',
    }
  ];

  const handleData = (data: {}) => {
    const d:Array<Object> = []
    Object.keys(data).forEach((key) => {
      const item = {
        key,
        desc: data[key].operation_price
      }
      d.push(item)
    })
    console.log(d)
    return d;
  }

  useEffect(() => {
    let id = 0;
    const loop = () => {
      id = window.setTimeout(() => {
        const { current } = actionRef;
        if (current) {
          current.reload();
        }
        loop();
      }, 5000);
    };
    loop();
    return () => {
      window.clearTimeout(id);
    };
  }, []);
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="股票价格监控"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        postData={(data) => handleData(data)}
        columns={columns}
      />
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
