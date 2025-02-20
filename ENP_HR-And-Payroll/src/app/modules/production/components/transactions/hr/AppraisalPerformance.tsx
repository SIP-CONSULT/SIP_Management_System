import { Button, Input, Modal, Space, Table, RadioChangeEvent, Select, Divider } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Api_Endpoint, fetchAppraisals, fetchAppraisalTransactions, fetchEmployees, fetchJobTitles, fetchPaygroups, fetchPeriods, fetchParameters } from '../../../../../services/ApiCalls'
import { useQuery } from 'react-query'
import "./cusStyle.css"
import { useForm } from 'react-hook-form'
import { PlusOutlined } from "@ant-design/icons"


const AppraisalPerformance = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { reset, register, handleSubmit } = useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tabModalOpen, setTabModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [tab1ModalOpen, setTab1Modal1Open] = useState(false)
  const [tab2ModalOpen, setTab2ModalOpen] = useState(false)
  const [tab3ModalOpen, setTab3ModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tab1");
  const [employeeRecord, setEmployeeRecord] = useState<any>([])
  const [employeeId, setEmployeeId] = useState<any>()
  const [jobTitleName, setjobTitleName] = useState<any>(null);
  const [selectedValue1, setSelectedValue1] = useState<any>(null);
  const [selectedValue2, setSelectedValue2] = useState<any>(null);
  const [selectedValue3, setSelectedValue3] = useState<any>(null);
  const [selectedValue4, setSelectedValue4] = useState<any>(null);
  const [selectedValue5, setSelectedValue5] = useState<any>(null);
  const [radioValue, setRadioValue] = useState(1);
  const [radio1Value, setRadio1Value] = useState(1);
  const [radio2Value, setRadio2Value] = useState(1);
  const [radio3Value, setRadio3Value] = useState(1);
  const [radio4Value, setRadio4Value] = useState(1);
  const tenantId = localStorage.getItem('tenant')
  const [fieldInit, setFieldInit] = useState([])
  const [isReviewDateModalOpen, setIsReviewDateModalOpen] = useState(false)
  const [reivewDateSubmitLoading, setReviewDateSubmitLoading] = useState(false)

  

  const [textareaValue, setTextareaValue] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');

  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea: any = document.getElementById('resizable-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Limit height to 10 lines
    if (textarea.scrollHeight > 10 * parseFloat(getComputedStyle(textarea).lineHeight)) {
      textarea.style.overflowY = 'scroll';
      textarea.style.height = `${10 * parseFloat(getComputedStyle(textarea).lineHeight)}px`;
    } else {
      textarea.style.overflowY = 'hidden';
    }

    setTextareaHeight(`${textarea.style.height}`);
  };


  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };


  const onRadioChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };
  const onRadio1Change = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadio1Value(e.target.value);
  };
  const onRadio2Change = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadio2Value(e.target.value);
  };
  const onRadio3Change = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadio3Value(e.target.value);
  };
  const onRadio4Change = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadio4Value(e.target.value);
  };

  const handleCancel = () => {
    reset()
    setEmployeeRecord([])
    setIsModalOpen(false)
    setUpdateModalOpen(false)

  }

  const handleReviewDateCancel = () => {
    reset()
    setIsReviewDateModalOpen(false)
  }

  

  const showTabModal = () => {
    setTabModalOpen(true)
  }
  const handleUpdateCancel = () => {
    setUpdateModalOpen(false)
  }
  const showUpdateModal = (record: any) => {
    console.log(record)
    setUpdateModalOpen(true)
    setEmployeeId(record)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${ENP_URL}/AppraisalPerfTransactions/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }
  const [fileList, setFileList] = useState<UploadFile[]>([

  ]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  const { data: alEmployees } = useQuery('employees', () => fetchEmployees(tenantId), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchAppraisals(tenantId), { cacheTime: 5000 })
  const { data: allPeriods } = useQuery('periods', () => fetchPeriods(tenantId), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobTitles', () => fetchJobTitles(tenantId), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('recruitments', () => fetchPaygroups(tenantId), { cacheTime: 5000 })
  const { data: allAppraisalTransactions } = useQuery('appraisalTransactions', () => fetchAppraisalTransactions(tenantId), { cacheTime: 5000 })
  const { data: allParameters } = useQuery('parameters', () => fetchParameters(tenantId), { cacheTime: 5000 })

  const columns: any = [
    {
      title: 'First Name',
      key: 'employeeId',
      render: (row: any) => {
        return getFirstName(row.employeeId)
      },
      sorter: (a: any, b: any) => {
        if (a.employeeId > b.employeeId) {
          return 1
        }
        if (b.employeeId > a.employeeId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Surname',
      //   dataIndex: 'surname',
      key: "employeeId",
      render: (row: any) => {
        return getSurname(row?.employeeId)
      },
      sorter: (a: any, b: any) => {
        if (a.surname > b.surname) {
          return 1
        }
        if (b.surname > a.surname) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'DOB',
      render: (row: any) => {
        return getDOB(row.employeeId)
      },
      sorter: (a: any, b: any) => {
        if (a.dob > b.dob) {
          return 1
        }
        if (b.dob > a.dob) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Gender',
      render: (row: any) => {
        return getGender(row.employeeId)
      },
      sorter: (a: any, b: any) => {
        if (a.sex > b.sex) {
          return 1
        }
        if (b.sex > a.sex) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Job Title',
      render: (row: any) => {
        return getJobTitle(row.employeeId)
      },
      sorter: (a: any, b: any) => {
        if (a.jobt > b.jobt) {
          return 1
        }
        if (b.jobt > a.jobt) {
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
          <a onClick={() => showUpdateModal(record.id)} className='btn btn-light-info btn-sm'>
            Details
          </a>

        </Space>
      ),

    },
  ]
  const columnTab1 = [

    {
      title: '#',
      dataIndex: 'key',
      sorter: (a: any, b: any) => {
        if (a.key > b.key) {
          return 1
        }
        if (b.key > a.key) {
          return -1
        }
        return 0
      },
    },
  ]
  const columnTab4 = [

    {
      title: '#',
      dataIndex: 'key',
      sorter: (a: any, b: any) => {
        if (a.key > b.key) {
          return 1
        }
        if (b.key > a.key) {
          return -1
        }
        return 0
      },
    },
  ]
  const columnTab2 = [

    {
      title: '#',
      dataIndex: 'key',
      sorter: (a: any, b: any) => {
        if (a.key > b.key) {
          return 1
        }
        if (b.key > a.key) {
          return -1
        }
        return 0
      },
    },
  ]
  const columnTab3 = [

    {
      title: '#',
      dataIndex: 'key',
      sorter: (a: any, b: any) => {
        if (a.key > b.key) {
          return 1
        }
        if (b.key > a.key) {
          return -1
        }
        return 0
      },
    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/AppraisalPerfTransactions/tenant/${tenantId}`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const dataByID: any = gridData.filter((refId: any) => {
    return refId.appraisalTypeId === parseInt(selectedValue2)
  })

  const emplyeesByPaygroup: any = alEmployees?.data?.filter((item: any) => {
    return item.paygroupId === parseInt(selectedValue1)
  })

  const emplyeeDetails: any = allAppraisalTransactions?.data?.find((item: any) => {
    return item.id === employeeId
  })

  // console.log(emplyeeDetails)

  const onEmployeeChange = (objectId: any) => {
    const newEmplo = alEmployees?.data?.find((item: any) => {
      return item.id === parseInt(objectId)
    })
    setEmployeeRecord(newEmplo)
  }
  const getFirstName = (employeeId: any) => {
    let firstName = null
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        firstName = item.firstName
      }
    })
    return firstName
  }
  const getSurname = (employeeId: any) => {
    let surname = null
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        surname = item.surname
      }
    })
    return surname
  }
  const getID = (employeeId: any) => {
    let Id = null
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        Id = item.id
      }
    })
    return Id
  }
  const getGender = (employeeId: any) => {
    let gender = null
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        gender = item.gender
      }
    })
    return gender
  }
  const getDOB = (employeeId: any) => {
    let surname = ""
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        surname = item?.dob?.substring(0, 10)
      }
    })
    return surname
  }

  const getJobTitle = (employeeId: any) => {
    let jobTitleId: any = null
    alEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        jobTitleId = item.jobTitleId
      }
    })
    let jobTitleName = null
    allJobTitles?.data.map((item: any) => {
      if (item.id === jobTitleId) {
        jobTitleName = item.name
      }
    })
    return jobTitleName
  }

  const parameterByAppraisal = allParameters?.data.filter((section: any) => section.appraisalId === parseInt(selectedValue2))
    .map((item: any) => ({
      ...item,
      score: '',
      comment: '',
    }))

  const showModal = () => {
    setIsModalOpen(true)
    setFieldInit(parameterByAppraisal)
  }

  const handleSelectedChange = (e: any) => {
    setSelectedValue2(e.target.value)
    setFieldInit(parameterByAppraisal)
  }
  const handleScoreChange = (e: any, userId: any) => {
    const newUsers: any = fieldInit.map((user: any) => {
      if (user.id === userId) {
        return { ...user, score: parseInt(e.target.value) };
      }
      return user;
    });
    setFieldInit(newUsers);
  };

  const handleCommentChange = (e: any, userId: any) => {
    const newUsers: any = fieldInit.map((user: any) => {
      if (user.id === userId) {
        return { ...user, comment: e.target.value };
      }
      return user;
    });
    setFieldInit(newUsers);
  };

  useEffect(() => {
    const getjobTitleName = () => {
      let jobTitleName = ""
      allJobTitles?.data.map((item: any) => {
        if (item.id === employeeRecord?.jobTitleId) {
          jobTitleName = item.name
        }
      })
      setjobTitleName(jobTitleName)
      return jobTitleName
    }


    getjobTitleName()
    loadData()
  }, [allJobTitles?.data, employeeRecord?.jobTitleId])

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

  const submitReviewDate = async (values: any) => {
    setSubmitLoading(true)
    const data = {
      date: values.date,  
      description: values.description,
    }
    try {
      setSubmitLoading(false)
      handleReviewDateCancel()
    } catch (error: any) {
   
    }
  }

  const endpoint = `${Api_Endpoint}/AppraisalPerfTransactions`
  const submitApplicant = handleSubmit(async (values) => {
    setLoading(true)
    const data = {
      paygroupId: parseInt(selectedValue1),
      appraisalTypeId: parseInt(selectedValue2),
      employeeId: employeeRecord.id,
      startPeriod: selectedValue3,
      endPeriod: selectedValue4,
      appraTranItems: fieldInit.map((item: any) => ({
        parameterId: item.id,
        score: item.score.toString(),
        comment: item.comment,
      })),
      tenantId: tenantId,
    }
    console.log(data)
    try {

      const response = await axios.post(endpoint, data)
      setSubmitLoading(false)
      reset()
      setIsModalOpen(false)
      loadData()
      return response.statusText

    } catch (error: any) {
      setSubmitLoading(false)
      return error.message
    }

  })

  const reviewDatesColumn = [
    {
      title: 'Date',
      dataIndex: 'reviewDate',
    }
    ,
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      render: (text: any, record: any) => (
        <a className='btn btn-light-danger btn-sm' onClick={() => { }}>
          Delete
        </a>
      ),
    }
  ]

  const showReviewDateModal = () => {
    setIsReviewDateModalOpen(true)
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
      <form onSubmit={submitApplicant}>
        <div style={{ padding: "20px 0px 0 0px" }} className='col-12 row mb-0'>
          <div className='col-6 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Paygroup</label>
            <select value={selectedValue1} onChange={(e) => setSelectedValue1(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select paygroup">select paygroup</option>
              {allPaygroups?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='col-6 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Appraisal Type</label>
            <select value={selectedValue2} onChange={handleSelectedChange} className="form-select form-select-solid" aria-label="Select example">
              <option value="select appraisal type">select appraisal type</option>
              {allAppraisals?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ padding: "0px 0px 0 0px" }} className='col-12 row mb-0'>
          <div className='col-6 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Start Period</label>
            <select value={selectedValue3} onChange={(e) => setSelectedValue3(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select start period">select start period</option>
              {allPeriods?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='col-6 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">End Period</label>
            <select value={selectedValue4} onChange={(e) => setSelectedValue4(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select end period"> select end period</option>
              {allPeriods?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
      {
        selectedValue1 === null
          || selectedValue2 === null
          || selectedValue3 === null
          || selectedValue4 === null
          || selectedValue1 === "select paygroup"
          || selectedValue2 === "select appraisal type"
          || selectedValue3 === "select start period"
          || selectedValue4 === "select end period" ? "" :
          <KTCardBody className='py-4 '>
            <div className='table-responsive'>
              {
                <>
                  <div style={{ padding: "0px 0px 0 0px" }} className='col-12 row mb-0'>
                    <div className='col-6 mb-7'>
                      <span className='form-label' >Objectives</span>
                      <textarea
                        name='objectives'
                        id="resizable-textarea"
                        className="form-control mb-7 mt-2"
                        value={textareaValue}
                        onChange={handleTextareaChange}
                        style={{ height: textareaHeight }}
                      />
                    </div>

                    <div className='col-6 mb-7'>
                      <div className='d-flex justify-content-between'>
                        <span className='form-label' >Review Dates</span>
                      </div>
                      <div
                        style={{
                          backgroundColor: 'white',
                          padding: '20px',
                          borderRadius: '5px',
                          boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
                        }}
                        className="border border-gray-400"
                      >
                        <Space className="justify-content-end align-items-end d-flex mb-2" >
                          <Button
                            onClick={showReviewDateModal}
                            className="btn btn-light-primary me-3 justify-content-center align-items-center d-flex"
                            style={{ width: '32px', height: '32px', borderRadius: '100%' }}
                            type="primary" shape="circle" icon={<PlusOutlined style={{ fontSize: '16px' }} />} size={'small'} />
                        </Space>

                        <Table columns={reviewDatesColumn} dataSource={[]} pagination={{ defaultPageSize: 3 }} />
                      </div>
                    </div>
                  </div>

                </>
              }
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

              <Table columns={columns} key={dataByID.id} dataSource={dataByID} />

              <Modal
                title='Employee Details '
                open={isModalOpen}
                onCancel={handleCancel}
                closable={true}
                width="900px"
                footer={[
                  <Button key='back' onClick={handleCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    onClick={submitApplicant}
                  >
                    Submit
                  </Button>,
                ]}
              >
                <form onSubmit={submitApplicant}>
                  <hr></hr>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label ">Employee ID</label>

                      <br></br>
                      <Select
                        {...register("employeeId")}
                        showSearch
                        placeholder="select a reference"
                        optionFilterProp="children"
                        style={{ width: "300px" }}
                        value={employeeRecord.id}
                        onChange={(e) => {
                          onEmployeeChange(e)
                        }}
                      >
                        <option>select</option>
                        {emplyeesByPaygroup?.map((item: any) => (
                          <option key={item.id} value={item.id}>{item.firstName} - {item.surname}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>

                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Job Title</label>
                      <input type="text" name="code" readOnly value={jobTitleName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Job Role</label>
                      <input type="text" name="code" readOnly className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                      <input type="text" {...register("firstName")} readOnly defaultValue={employeeRecord?.firstName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Surname</label>
                      <input type="text" {...register("surname")} readOnly defaultValue={employeeRecord?.surname} className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 10px 20px" }} className='row mb-7 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">DOB</label>
                      <input type="text" {...register("dob")} readOnly defaultValue={employeeRecord?.dob?.substring(0, 10)} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Gender</label>
                      <input type="text" {...register("gender")} readOnly defaultValue={employeeRecord?.gender} className="form-control form-control-solid" />

                    </div>
                  </div>
                  <hr></hr>
                  {fieldInit?.map((user: any) => (
                    <div style={{ padding: '10px 20px 10px 20px' }} className="col-12" key={user.id}>
                      <label style={{ fontWeight: "bold" }} htmlFor="exampleFormControlInput1" className="form-label">
                        {user.name}
                      </label>
                      <div className='row'>
                        <div className='col-6'>
                          <label htmlFor="exampleFormControlInput1" className="form-label">
                            Score
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            placeholder='score from 1 to 5'
                            className="form-control form-control-solid"
                            value={user.score}
                            onChange={(e) => handleScoreChange(e, user.id)}
                          />
                        </div>
                        <div className='col-6'>
                          <label htmlFor="exampleFormControlInput1" className="form-label">
                            Comment
                          </label>
                          <textarea
                            value={user.comment}
                            onChange={(e) => handleCommentChange(e, user.id)}
                            className="form-control form-control-solid"
                            placeholder="comments (optional)"
                            aria-label="With textarea"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "20px 20px 30px 20px" }} className='col-12 mb-3'>
                    <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Supporting Document :</label>

                    <input {...register("documentUrl")} className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' type="file" />
                  </div>

                  {/* <form>
                    <hr></hr>
                  <div>
                    <div style={{display:"flex", }} className="tabs">
                      <div
                        className={`tab ${activeTab === "tab1" ? "active" : ""}`}
                        onClick={() => handleTabClick("tab1")}
                      >
                        Accomplishments
                      </div>

                      <div className={`tab ${activeTab === "tab2" ? "active" : ""}`}
                        onClick={() => handleTabClick("tab2")}
                      >
                        Areas of Improvements
                      </div>
                      <div
                        className={`tab ${activeTab === "tab3" ? "active" : ""}`}
                        onClick={() => handleTabClick("tab3")}
                      >
                        Goals for Performance
                      </div>
                      <div
                        className={`tab ${activeTab === "tab4" ? "active" : ""}`}
                        onClick={() => handleTabClick("tab4")}
                      >
                        Supporting Documentation
                      </div>
                    </div>
                    <div className="tab-content">
                      {activeTab === "tab1" && 
                      <div>
                        <div className='col-12 mb-3'>
                          <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score</label>
                          <Radio.Group onChange={onRadio1Change} value={radio1Value}>
                            <Radio value={1}>1</Radio>
                            <Radio value={2}>2</Radio>
                            <Radio value={3}>3</Radio>
                            <Radio value={4}>4</Radio>
                            <Radio value={5}>5</Radio>
                          </Radio.Group>
                          <textarea style={{ margin: "10px 0px 0 0px" }} {...register("accomComment")} className="form-control form-control-solid" placeholder='comments (optional)' aria-label="With textarea"></textarea>
                        </div>
                        
                      </div>}
                      
                      {activeTab === "tab2" && 
                      <div>
                        <div className='col-12 mb-3'>
                          <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score</label>
                          <Radio.Group onChange={onRadio2Change} value={radio2Value}>
                            <Radio value={1}>1</Radio>
                            <Radio value={2}>2</Radio>
                            <Radio value={3}>3</Radio>
                            <Radio value={4}>4</Radio>
                            <Radio value={5}>5</Radio>
                          </Radio.Group>
                          <textarea style={{ margin: "10px 0px 0 0px" }} {...register("improvComment")} className="form-control form-control-solid" placeholder='comments (optional)' aria-label="With textarea"></textarea>
                        </div>
                      </div>}

                      {activeTab === "tab3" && 
                      <div>
                        <div className='col-12 mb-3'>
                          <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score</label>
                          <Radio.Group onChange={onRadio3Change} value={radio3Value}>
                            <Radio value={1}>1</Radio>
                            <Radio value={2}>2</Radio>
                            <Radio value={3}>3</Radio>
                            <Radio value={4}>4</Radio>
                            <Radio value={5}>5</Radio>
                          </Radio.Group>
                          <textarea style={{ margin: "10px 0px 0 0px" }} {...register("goalComment")} className="form-control form-control-solid" placeholder='comments (optional)' aria-label="With textarea"></textarea>
                        </div>
                      </div>}

                      {activeTab === "tab4" && 
                      <div>
                        <div className='col-12 mb-3'>
                          <input {...register("documentUrl")}  className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' type="file" />
                        
                        </div>
                      </div>}
                    </div>
                  </div>
                </form> */}
                </form>
              </Modal>
              <Modal
                title={"Details of ID " + employeeId}
                open={updateModalOpen}
                onCancel={handleUpdateCancel}
                closable={true}
                width="900px"
                footer={[
                  <Button key='back' onClick={handleUpdateCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    onClick={submitApplicant}
                  >
                    Done
                  </Button>,
                ]}
              >
                <h3>Will be updated soon</h3>
              </Modal>
              <Modal
                title='Add a review date'
                open={isReviewDateModalOpen}
                onCancel={handleReviewDateCancel}
                closable={true}
                footer={[
                  <Button key='back' onClick={handleReviewDateCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={reivewDateSubmitLoading}
                    onClick={submitReviewDate}
                  >
                    Done
                  </Button>,
                ]}
              >
                <form>
                  <div className='row mb-7 mt-7'>
                    <div className='col-12 mb-7'>
                      <label htmlFor='exampleFormControlInput1' className='form-label'>Review Date</label>
                      <input
                        {...register("reviewDate")}
                        type='date'
                        className='form-control form-control-solid'
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                      <input
                        {...register("description")}
                        // onChange={handleChange}
                        className="form-control form-control-solid" />
                    </div>
                  </div>
                </form>
              </Modal>
            </div>
          </KTCardBody>
      }

    </div >
  )
}

export { AppraisalPerformance }



