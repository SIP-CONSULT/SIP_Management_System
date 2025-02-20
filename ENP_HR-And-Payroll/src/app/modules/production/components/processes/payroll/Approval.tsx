import {Button, Form, Input, InputNumber, Modal, Space, Table} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'

const Approval = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('tab1');
  const tenantId = localStorage.getItem('tenant')
  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${ENP_URL}/ProductionActivity/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  

  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [
   
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          
          {/* <Link to={`/setup/sections/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Sections</span>
          </Link> */}
          <a href='#' className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
         
        </Space>
      ),
      
    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${ENP_URL}/ProductionActivity`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const dataWithIndex = gridData.map((item: any, index) => ({
    ...item,
    key: index,
  }))

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithVehicleNum.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

  const url = `${ENP_URL}/ProductionActivity`
  const onFinish = async (values: any) => {
    setSubmitLoading(true)
    const data = {
      name: values.name,
    }

    console.log(data)

    try {
      const response = await axios.post(url, data)
      setSubmitLoading(false)
      form.resetFields()
      setIsModalOpen(false)
      loadData()
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
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
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
            <div className="tabs">
              
              <button 
                className={`tab ${activeTab === 'tab1' ? 'active' : ''}`} 
                onClick={() => handleTabClick('tab1')}
              >
                Timesheets
              </button>
              <button 
                className={`tab ${activeTab === 'tab2' ? 'active' : ''}`} 
                onClick={() => handleTabClick('tab2')}
              >
                Recurrent Transactions
              </button>
              <button 
                className={`tab ${activeTab === 'tab3' ? 'active' : ''}`} 
                onClick={() => handleTabClick('tab3')}
              >
                Non-recurrent Transactions
              </button>
            
              
              
            </div>
                  
            <div className="tab-content">

              {/* Details */}
              {activeTab === 'tab1' && 
                <div className='d-flex justify-content-between'>
                  <Space style={{marginBottom: 16}}>
                    <Input
                      placeholder='Enter Search Text'
                      onChange={handleInputChange}
                      type='text'
                      allowClear
                      value={searchText}
                    />
                    <Button type='primary' onClick={globalSearch}>
                      Search
                    </Button>
                  </Space>
                  <Space style={{marginBottom: 16}}>
                    <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                      <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                      Add
                    </button>
      
                  </Space>
                </div>
                }

              {/* Communications */}
              {
              activeTab === 'tab2' && 
              <div className='d-flex justify-content-between'>
                <Space style={{marginBottom: 16}}>
                  <Input
                    placeholder='Enter Search Text'
                    onChange={handleInputChange}
                    type='text'
                    allowClear
                    value={searchText}
                  />
                  <Button type='primary' onClick={globalSearch}>
                    Search
                  </Button>
                </Space>
                <Space style={{marginBottom: 16}}>
                  <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Add
                  </button>
    
                </Space>
              </div>
              }
              {/* Communications */}
              {
              activeTab === 'tab3' && 
              <div className='d-flex justify-content-between'>
                <Space style={{marginBottom: 16}}>
                  <Input
                    placeholder='Enter Search Text'
                    onChange={handleInputChange}
                    type='text'
                    allowClear
                    value={searchText}
                  />
                  <Button type='primary' onClick={globalSearch}>
                    Search
                  </Button>
                </Space>
                <Space style={{marginBottom: 16}}>
                  <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Add
                  </button>
    
                </Space>
              </div>
              }

            </div>
            
          <Table columns={columns}  />
          
        </div>
      </KTCardBody>
    </div>
  )
}

export {Approval}
