import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, message, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../lib/axios";
import SubjectContent from "./SubjectContent";

const { Option } = Select;

export interface ISubjects {
  id: number,
  subjectName: string
}

export interface ISessions {
  id: number,
  sessionName: string
}

const priorities = [
  {
    id: 1,
    value: "high",
    text: "Quan trọng"
  },
  {
    id: 2,
    value: "medium",
    text: "Cần thiết"
  },
  {
    id: 3,
    value: "low",
    text: "Không quá quan trọng"
  }
]

export default function Subject() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState<ISubjects[]>([]);
  const [sessions, setSessions] = useState<ISessions[]>([]);

  const [newSubject, setNewSubject] = useState("");
  const [newSession, setNewSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch subjects on component mount
  React.useEffect(() => {
    handleFetchSubject();
  }, []);

  // Trong component Subject, thêm:
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleFetchSubject = async () => {
    const response = await api.get("/academics/subjects")
    setSubjects(response.data)
  }

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log(values)
      await api.post('/academics/create-lesson', values);

      message.success('Tạo bài học mới thành công!');
      // form.resetFields();
      // setIsModalVisible(false);
    } catch (err: any) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message.error(`Lỗi: ${err.response.data?.message || 'Có lỗi xảy ra khi tạo bài học'}`);
      } else if (err.request) {
        // The request was made but no response was received
        message.error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.');
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error('Có lỗi xảy ra: ' + err.message);
      }
      console.error("Error creating lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onSubjectChange = async (value: string) => {
    const subjectId = subjects.find(subject => subject.subjectName === value)
    setSelectedSubject(value);
    form.setFieldsValue({ session: undefined }); // Reset session when subject changes
    const response = await api.get(`/academics/session?subjectId=${subjectId?.id}`)

    setSessions(response.data)
  };

  const addNewSubject = async () => {
    if (newSubject.trim()) {
      const response = await api.post('/academics/create-subject', {
        subjectName: newSubject
      })

      setSubjects([...subjects, response.data]);
      setNewSubject("");
      message.success("New subject added!");
    }
  };

  const addNewSession = () => {
    if (newSession.trim() && selectedSubject) {
      const newId =
        sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
      setSessions([
        ...sessions,
        { id: newId, sessionName: newSession },
      ]);
      setNewSession("");
      message.success("New session added!");
    }
  };

  return (
    <div className="w-full h-full">
      <Card
        title="Quản lý môn học"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleFetchSubject();
              showModal();
            }}
          >
            Thêm bài học mới
          </Button>
        }
      >
        <SubjectContent />
      </Card>

      <Modal
        title="Thêm bài học mới"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Tạo mới
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subjectName"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select
              placeholder="Chọn môn học"
              onChange={onSubjectChange}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="Tên môn học mới"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                    />
                    <Button
                      type="link"
                      onClick={addNewSubject}
                      icon={<PlusOutlined />}
                    >
                      Thêm
                    </Button>
                  </div>
                </>
              )}
            >
              {subjects.map((subject) => (
                <Option key={subject.id} value={subject.subjectName}>
                  {subject.subjectName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="sessionName"
            label="Buổi học"
            rules={[{ required: true, message: 'Vui lòng chọn buổi học' }]}
          >
            <Select
              placeholder="Chọn buổi học"
              disabled={!selectedSubject}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="Tên buổi học mới"
                      value={newSession}
                      onChange={(e) => setNewSession(e.target.value)}
                      disabled={!selectedSubject}
                    />
                    <Button
                      type="link"
                      onClick={addNewSession}
                      icon={<PlusOutlined />}
                      disabled={!selectedSubject}
                    >
                      Thêm
                    </Button>
                  </div>
                </>
              )}
            >
              {sessions.map((session) => (
                <Option key={session.id} value={session.sessionName}>
                  {session.sessionName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="lessonName"
            label="Tên bài học"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài học' }]}
          >
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức độ quan trọng"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ quan trọng' }]}
          >
            <Select
              placeholder="Chọn mức độ quan trọng"
              popupRender={(menu) => (
                <>
                  {menu}
                </>
              )}
            >
              {priorities.map((priority) => (
                <Option key={priority.id} value={priority.value}>
                  {priority.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
