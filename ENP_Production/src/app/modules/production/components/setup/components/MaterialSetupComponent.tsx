import { Button, Input, Modal, Space, Table, message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { KTCardBody } from "../../../../../../_metronic/helpers"
import { deleteItem, fetchDocument, postItem, updateItem } from "../../../urls"
import { ModalFooterButtons, PageActionButtons } from "../../CommonComponents"

const MatComponet = (props: any) => {
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
    const tenantId = localStorage.getItem('tenant')
  
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
      onSuccess: (dataD) => {
        queryClient.setQueryData([props.data.url, tempData], dataD);
        loadData()
      },
      onError: (error) => {
        console.log('delete error: ', error)
        message.error(` ${error}`, )
      }
    })
  
    function handleDelete(element: any) {
      const item = {
        url: props.data.url,
        data: element,
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
        const response = await fetchDocument(`${props.data.url}/tenant/${tenantId}`)
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
        queryClient.setQueryData([props.data.url, tempData], data);
        reset()
        setTempData({})
        loadData()
        setIsUpdateModalOpen(false)
        setIsModalOpen(false)
      },
      onError: (error) => {
        console.log('error: ', error)
        setIsUpdateModalOpen(false)
        message.error(` ${error}`, )
      }
    })
  
    const handleUpdate = (e: any) => {
      if (tempData.name === '') {
        message.error('Please fill all the fields')
      } else {
        e.preventDefault()
        const item = {
          url: props.data.url,
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
      if (tempData.name === '' ) {
        message.error('Please fill all the fields')
      } else {
        const item = {
          data: {
            name: values.name,
            tenantId:tenantId,
          },
          url: props.data.url
        }
        console.log(item.data)
        postData(item)
      }
    })
  
    const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
      onSuccess: (data) => {
        queryClient.setQueryData([props.data.url, tempData], data);
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
        message.error(` ${error}`, )
      }
    })
  
    return (
      <div>
        <KTCardBody className='py-4 '>
          <div className='table-responsive'>
            <div className='d-flex justify-content-between'>
              <Space style={{ marginBottom: 16 }}>
                <Input
                  placeholder='Enter Search Text'
                  onChange={handleInputChange}
                  type='text'
                  allowClear
                  value={searchText} size='large'
                />
                <Button type='primary' onClick={globalSearch} size='large'>
                  Search
                </Button>
              </Space>
              <Space style={{ marginBottom: 16 }}>
                <PageActionButtons
                  onAddClick={showModal}
                  onExportClicked={() => { console.log('export clicked') }}
                  hasAddButton={true}
                  hasExportButton={true}
                />
              </Space>
            </div>
            <Table columns={columns} dataSource={dataWithIndex} loading={loading} />
  
            <Modal
              title={isUpdateModalOpen ? `${props.data.title} Update` : `${props.data.title} Setup`}
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
                    <label htmlFor="exampleFormControlInput1" className="form-label text-gray-500">Name</label>
                    <input {...register("name")} name='name' defaultValue={!isUpdateModalOpen ? '' : tempData?.name} onChange={handleChange} className="form-control form-control-white" />
                  </div>
                </div>
              </form>
            </Modal>
          </div>
        </KTCardBody>
      </div>
    )
  }

  export { MatComponet }

