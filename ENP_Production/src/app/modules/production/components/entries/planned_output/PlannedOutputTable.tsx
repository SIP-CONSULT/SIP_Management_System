import {
  Button, DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Upload,
} from 'antd'
import { KTSVG } from '../../../../../../_metronic/helpers'
import { useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { fetchDocument } from '../../../urls';
import { useQuery } from 'react-query';

const PlannedOutputTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const columns: any = [
    {
      title: 'Destinaton',
      dataIndex: '',
      key: 'key',
    },
    {
      title: 'Activity',
      dataIndex: 'vmModel',
    },
    {
      title: 'Quantity',
      dataIndex: 'downType',
    },
  ]
  const showModal = () => {
    setIsModalOpen(true)
  }

  const showUploadModal = () => {
    setIsUploadModalOpen(true)
    console.log('upload modal clicked')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsUploadModalOpen(false)
  }

  const { data: destinations } = useQuery('destinations', () => fetchDocument('IclocsApi'), { cacheTime: 5000 })


  // onchange for the select
  const onChange = (value: any) => {
    console.log(`selected ${value}`);
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <div className='d-flex justify-content-between'>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder='Enter Search Text'
            type='text'
            allowClear size='large'
          />
          <Button type='primary' size='large'>
            Search
          </Button>
        </Space>
        <Space style={{ marginBottom: 16 }}>
          <Button type='primary' className='btn btn-primary me-3' onClick={showModal} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} size='large'>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
            Add
          </Button>
          <Button type='primary' className='btn btn-light-primary me-3' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} size='large'
            onClick={showUploadModal}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
            Upload
          </Button>
          <Button type='primary' className='btn btn-light-primary me-3' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} size='large'>
            <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
            Export
          </Button>
        </Space>
      </div>
      <Table columns={columns} bordered />

      {/*Add Fault*/}
      <Modal
        title='Planned Output'
        open={isModalOpen}
        onCancel={handleCancel}
        closable={true}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            htmlType='submit'
          >
            Submit
          </Button>,
        ]}
      >
        <Divider />
        <Form
          name='control-hooks'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          title='Add Fault'
        >
          <Form.Item
            name='Destination'
            label='Destination'
            rules={[{ required: true, message: 'Please input destination!' }]}
          >
            <Select onChange={onChange}>
              {
                destinations?.data.map((destination: any) => (
                  <Select.Option value={destination.locationCode}>{destination.locationDesc}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name='Activity'
            label='Activity'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='Quantity'
            label='Quantity'
            rules={[{ required: true, type: "number" }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>

      {/* Modal to upload file */}
      <Modal
        title='Upload Planned Output'
        open={isUploadModalOpen}
        onCancel={handleCancel}
        closable={true}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            htmlType='submit'
          >
            Submit
          </Button>,
        ]}
      >
        <Divider />
        <Form
          name='control-hooks'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          title='Add Fault'
        >
          <Space size='large'>
            <Upload>
              <Button
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Space>

        </Form>
      </Modal>
    </div>
  )
}

export { PlannedOutputTable }
