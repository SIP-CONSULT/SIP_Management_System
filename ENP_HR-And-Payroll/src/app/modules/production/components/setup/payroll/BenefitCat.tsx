import { Button, Form, Input, InputNumber, Modal, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { useForm } from 'react-hook-form'
import { Api_Endpoint, fetchCurrencies, fetchGrades, fetchPaygroups, updateBenefitCats } from '../../../../../services/ApiCalls'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom'

const BenefitCats = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [tempData, setTempData] = useState<any>()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsUpdate(false)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/BenefitCats/${element.id}`)
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }


  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [

    {
      title: 'Code',
      dataIndex: 'code',
      sorter: (a: any, b: any) => {
        if (a.code > b.code) {
          return 1
        }
        if (b.code > a.code) {
          return -1
        }
        return 0
      },
    },
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
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
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
      const response = await axios.get(`${Api_Endpoint}/BenefitCats`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    loadData()
  }, [])

  //   const dataByID = gridData.filter((section:any) =>{
  //     return section.gradeId.toString() === param.id
  //   })

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

  const url = `${Api_Endpoint}/BenefitCats`
  const OnSUbmit = handleSubmit(async (values) => {
    setLoading(true)
    const data = {
      code: values.code,
      name: values.name,
    }
    console.log(data)
    if (Object.keys(data.code).length === 0 || Object.keys(data.name).length === 0) {
      // do nothing
    } else {
      try {
        const response = await axios.post(url, data)
        setSubmitLoading(false)
        reset()
        setIsModalOpen(false)
        loadData()
        return response.statusText
      } catch (error: any) {
        setSubmitLoading(false)
        return error.statusText
      }
    }
  })


  const queryClient = useQueryClient()
  const { isLoading, mutate } = useMutation(updateBenefitCats, {
    onSuccess: (data) => {
      queryClient.setQueryData(['benefitCats', tempData.id], data);
      loadData()
      reset()
      setIsUpdate(false)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    mutate(tempData)
  }

  const showUpdateModal = (values: any) => {
    setIsUpdate(true)
    setTempData(values);
  }

  console.log(tempData)

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
          <Table columns={columns} dataSource={gridData} loading={loading} />
          <Modal
            title='BenefitCats Setup'
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
                loading={submitLoading}
                onClick={OnSUbmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={OnSUbmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                  <input type="text" {...register("code")} className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                  <input type="text" {...register("name")} className="form-control form-control-solid" />
                </div>


              </div>
            </form>
          </Modal>
          {/* update benefit category modal */}
          <Modal
            title='BenefitCats Update'
            open={isUpdate}
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
                loading={submitLoading}
                onClick={handleUpdate}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={handleUpdate}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                <div className=' mb-7'>
                  <label htmlFor="code" className="form-label">Code</label>
                  <input type="text"  {...register("code")} defaultValue={tempData?.code} onChange={handleChange} name='code' id='code' className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text"  {...register("name")} defaultValue={tempData?.name} onChange={handleChange} name='name' id='name' className="form-control form-control-solid" />
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { BenefitCats }
