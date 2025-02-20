import { Button, Form, Input, InputNumber, Modal, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { useForm } from 'react-hook-form'
import { Api_Endpoint, fetchCurrencies, fetchGrades, fetchPaygroups, fetchPerks, updateGradePerks } from '../../../../../services/ApiCalls'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

const GradePerks = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  let [paygroupName, setPaygroupName] = useState<any>("")
  let [gradeName, setGradeName] = useState<any>("")
  let [selectedPerk, setSelectedPerk] = useState<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tenantId = localStorage.getItem('tenant')

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

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/GradePerks/${element.id}`)
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
      title: 'Perk',
      key: 'perkId',
      render: (i: any) => {
        return getPerkName(i.perkId)
      },
      sorter: (a: any, b: any) => {
        if (a.perkId > b.perkId) {
          return 1
        }
        if (b.perkId > a.perkId) {
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
      const response = await axios.get(`${Api_Endpoint}/GradePerks/tenant/${tenantId}`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const { data: allGrades } = useQuery('grades', ()=> fetchGrades(tenantId), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', ()=> fetchPaygroups(tenantId), { cacheTime: 5000 })
  const { data: allPerks } = useQuery('perks', ()=> fetchPerks(tenantId), { cacheTime: 5000 })


  const getPerkName = (perkId: any) => {
    let perkName = null
    allPerks?.data.map((item: any) => {
      if (item.id === perkId) {
        perkName = item.name
      }
    })
    return perkName
  }
  const getItemName = async (param: any) => {

    let newName = null

    const itemTest = await allGrades?.data.find((item: any) =>
      item.id.toString() === param
    )
    newName = await itemTest
    return newName
  }


  const dataByID = gridData.filter((section: any) => {
    return section.gradeId.toString() === param.id
  })

  useEffect(() => {
    (async () => {
      let res = await getItemName(param.id)
      setGradeName(res?.name)
    })();
    (async () => {
      let res = await getItemName(param.id)
      let paygroupId = res?.paygroupId
      let paygroupName = allPaygroups?.data.find((div: any) => {
        return div.id === paygroupId
      })
      setPaygroupName(paygroupName?.name)
    })();
    loadData()
  }, [])

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
  const { isLoading, mutate } = useMutation(updateGradePerks, {
    onSuccess: (data) => {
      queryClient.setQueryData(['gradePerks', tempData.id], data);
      reset()
      setTempData({})
      loadData()
      setIsUpdateModalOpen(false)
    },
    onError: (error) => {
      console.log('error: ', error)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    mutate(tempData)
    console.log('update: ', tempData)
  }

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    console.log(values)
  }


  const url = `${Api_Endpoint}/GradePerks`
  const OnSUbmit = handleSubmit(async (values) => {
    setLoading(true)
    const data = {
      gradeId: parseInt(param.id),
      perkId: parseInt(values.perkId),
      tenantId: tenantId,
    }
    console.log(data)
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
          <h3 style={{ fontWeight: "bolder" }}>{paygroupName}<span style={{ color: "blue", fontSize: "22px", fontWeight: "normal" }}> &gt; </span> {gradeName} </h3>

          <br></br>
          <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
          <br></br>
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
          <Table columns={columns} dataSource={dataByID} loading={loading} />
          <Modal
            title='Perks Setup'
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
                {/* <div className=' mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                      <input type="text" {...register("code")}  className="form-control form-control-solid"/>
                    </div> */}
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Perk</label>
                  <select {...register("perkId")}  className="form-select form-select-solid" aria-label="Select example">
                    <option> Select </option>
                    {allPerks?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

              </div>
            </form>
          </Modal>

          {/* update modal */}

          <Modal
            title='Perks Update'
            open={isUpdateModalOpen}
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
                {/* <div className=' mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                      <input type="text" {...register("code")}  className="form-control form-control-solid"/>
                    </div> */}
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Perk</label>
                  <select {...register("perkId")} value={tempData?.perkId} onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                    {allPerks?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
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

export { GradePerks }
