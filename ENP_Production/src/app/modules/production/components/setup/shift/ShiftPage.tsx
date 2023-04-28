import { Button, Form, Input, InputNumber, Modal, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { ENP_URL, deleteItem, fetchDocument, postItem, updateItem } from '../../../urls'
import { Link } from 'react-router-dom'
import form from 'antd/es/form'
import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from 'react-query'
import { ModalFooterButtons } from '../../CommonComponents'

const ShiftPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [gridData, setGridData] = useState([])
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [loading, setLoading] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [tempData, setTempData] = useState<any>()
  const { register, reset, handleSubmit } = useForm()
  const queryClient = useQueryClient()

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const showUploadModal = () => {
    setIsUploadModalOpen(true)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsUploadModalOpen(false)
    setIsUpdateModalOpen(false)
  }

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['shifts', tempData], data);
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
      message.error('Error deleting record')
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'ProductionShift',
      data: element
    }
    deleteData(item)
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
      title: 'Duration',
      dataIndex: 'duration',
      sorter: (a: any, b: any) => a.duration - b.duration,
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
          <Space size='middle'>
            <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
              Update
            </a>
            <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
              Delete
            </a>
          </Space>

        </Space>
      ),

    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetchDocument('ProductionShift')
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
        value.fleetID.toLowerCase().includes(searchText.toLowerCase()) ||
        value.modlName.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }
  const { isLoading: updateLoading, mutate: updateData } = useMutation(updateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['shifts', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('error: ', error)
      setIsUpdateModalOpen(false)
      message.error('Something went wrong')
    }
  })

  const handleUpdate = (e: any) => {
    if (tempData.name === '' || tempData.duration === '') {
      message.error('Please fill all the fields')
    } else {
      e.preventDefault()
      const item = {
        url: 'ProductionShift',
        data: tempData
      }
      updateData(item)
      console.log('update: ', item.data)
    }
  }

  const showUpdateModal = (values: any) => {
    showModal()
    setIsUpdateModalOpen(true)
    setTempData(values);
    console.log(values)
  }


  const OnSubmit = handleSubmit(async (values) => {
    setSubmitLoading(true)
    if (tempData.name === '' || tempData.description === '') {
      message.error('Please fill all the fields')
    } else {
      const item = {
        data: {
          name: values.name,
          duration: values.duration,
        },
        url: 'ProductionShift'
      }
      console.log(item.data)
      postData(item)
    }
  })

  const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['shifts', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsModalOpen(false)
      setSubmitLoading(false)
    },
    onError: (error) => {
      setSubmitLoading(false)
      setIsModalOpen(false)
      console.log('post error: ', error)
      message.error('Error while adding data')
    }
  })

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
          <div className='d-flex justify-content-between'>
            <Space style={{ marginBottom: 16 }}>
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
            <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space>
          </div>
          <Table columns={columns} dataSource={dataWithIndex} bordered loading={loading} />
          <Modal
            title={isUpdateModalOpen ? `Shift Update` : `Shift Setup`}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
            footer={
              <ModalFooterButtons
                onCancel={handleCancel}
                onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit} />
            }
          >
            <form onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}>
              <hr></hr>
              <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                  <input {...register("name")} name='name' defaultValue={!isUpdateModalOpen ? '' : tempData?.name} onChange={handleChange} className="form-control form-control-white" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                  <input {...register("duration")} name='duration' defaultValue={!isUpdateModalOpen ? '' : tempData?.duration} onChange={handleChange} className="form-control form-control-white" />
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { ShiftPage }
