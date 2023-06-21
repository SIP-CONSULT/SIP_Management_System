import { Button, Form, Input, InputNumber, Modal, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Api_Endpoint, fetchDocument, fetchGrades, fetchLeaveTypes, fetchPaygroups, updateGrade, updateGradeLeave, updateItem } from '../../../../../services/ApiCalls'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const OrgLevel = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const currentLevel = parseInt(param.level) + 1
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [updateItem, setUpdateItem] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tenantId = localStorage.getItem('tenant')
  const [supervisorName, setSupervisorName] = useState('')
  const { data: allEmployees } = useQuery('employess', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })

  const levels = [
    'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6',
  ]
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsUpdateModalOpen(false)
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }

  const reRenderScreen = () => {
    if (currentLevel <= 6) {
      navigate(`/next/${param.id}/${currentLevel}`)
    }
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/organograms/${element.id}`)
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

  const employeeName = (employeeId: any) => {
    const employee = allEmployees?.data?.find((employee: any) => employee.id === employeeId)
    return `${employee?.firstName} ${employee?.surname}`
  }

  const columns: any = [
    {
      title: 'Employee',
      dataIndex: 'employeeId',
      sorter: (a: any, b: any) => {
        if (a.code > b.code) {
          return 1
        }
        if (b.code > a.code) {
          return -1
        }
        return 0
      },
      render: (employeeId: any) => employeeName(employeeId)
    },
    {
      title: 'Current Level',
      dataIndex: 'currentLevel',
      sorter: (a: any, b: any) => {
        if (a.startDate > b.startDate) {
          return 1
        }
        if (b.startDate > a.startDate) {
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
          {
            currentLevel < 6 ?
              <Link to={`/next/${record.id}/${currentLevel}`} >
                <span className='btn btn-light-info btn-sm' >Next</span>
              </Link>
              : null
          }
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

  const dataByID = gridData?.filter((section: any) => {
    return section?.gradeId?.toString() === param.id
  })



  // this filters for only gradeLeaves for the pARAM ID 

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/organograms`)
      const levelItem = response?.data.find((item: any) => item.id.toString() === param.id)
      const getSupervisor = allEmployees?.data?.find((employee: any) => employee.id === levelItem?.employeeId)
      const name = `${getSupervisor?.firstName} ${getSupervisor?.surname}`
      setSupervisorName(name)
      const filteredBySupervisor = response?.data.filter((item: any) => item?.supervisorId === parseInt(param.id))
      setGridData(filteredBySupervisor)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [param, currentLevel])

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

  const queryClient = useQueryClient()
  const { isLoading, mutate: updateData } = useMutation(updateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['organograms', tempData.id], data);
      reset()
      setTempData({})
      loadData()/*  */
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('error: ', error)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    if (tempData.employeeId != updateItem.employeeId) {
      // verify that the employeeId is not already in the organogram table
      const checkEmployee = allOrganograms?.data.find((item: any) => item.employeeId === tempData.employeeId)
      if (checkEmployee) {
        message.error('Employee already exists in the organogram table')
        return
      }
      updateData(tempData)
    } 
    updateData(tempData)
    console.log('update: ', tempData)
  }

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    showModal()
    setTempData(values);
    setUpdateItem(values)
    // console.log(values)
  }


  const url = `${Api_Endpoint}/organograms`
  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)
    const data = {
      employeeId: parseInt(values.employeeId),
      supervisorId: parseInt(param.id),
      currentLevel: `Level ${currentLevel}`,
      isAssistant: values.isAssistant === 'Select' ? '0' : values.isAssistant,
      tenantId: tenantId,
    }
    console.log(data)
    try {
      //if employeeId already exists in the organogram table, return error
      const checkEmployee = allOrganograms?.data.find((item: any) => item.employeeId === data.employeeId)
      if (checkEmployee) {
        setSubmitLoading(false)
        message.error(`Employee already exists in the organogram`)
        return
      }

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
          <div className="mb-5">
            <span className="fw-bold text-gray-800 d-block fs-2 mb-3 ">{supervisorName}</span>
            <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
          </div>
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
            title={isUpdateModalOpen ? 'Update Organogram ' : 'Add Employee to Organogram'}
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
                onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>


                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Employee</label>
                  <select {...register("employeeId")}
                    value={isUpdateModalOpen === true ? tempData?.employeeId : null}
                    onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                    {isUpdateModalOpen === false ? <option value="Select">Select</option> : null}
                    {
                      allEmployees?.data.map((item: any) => (
                        <option value={item.id}>{`${item?.firstName} ${item?.surname}`}</option>
                      ))
                    }
                  </select>
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Current Level</label>
                  <input type="text" {...register("currentLevel")} disabled={true}
                    defaultValue={isUpdateModalOpen === true ? tempData.currentLevel : `Level ${currentLevel}`}
                    onChange={handleChange} className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Is assistant</label>
                  <select {...register("isAssistant")}
                    value={isUpdateModalOpen === true ? tempData?.isAssistant : 'Select'}
                    onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                    {isUpdateModalOpen === false ? <option value="Select">Select</option> : null}
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { OrgLevel }
