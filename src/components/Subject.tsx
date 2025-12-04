import { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../lib/axios";

const { Option } = Select;

interface ISubjects {
  id: number,
  subjectName: string
}

interface ISessions {
  id: number,
  sessionName: string
}

export default function Subject() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState<ISubjects[]>([]);
  const [sessions, setSessions] = useState<ISessions[]>([]);

  const [newSubject, setNewSubject] = useState("");
  const [newSession, setNewSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setSelectedSubject(value);
    form.setFieldsValue({ session: undefined }); // Reset session when subject changes
    const response = await api.get(`/academics/session?subjectName=${value}`)

    setSessions(response.data)
  };

  const addNewSubject = async () => {
    if (newSubject.trim()) {
      const newId =
        subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
      setSubjects([...subjects, { id: newId, subjectName: newSubject }]);
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
    <div style={{ width: "65vw", height: "100vh" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          handleFetchSubject()
          showModal()
        }}
        style={{ marginBottom: "1rem", float: "right" }}
      >
        Add New Subject
      </Button>

      <Modal
        title="Add New Subject"
        open={isModalVisible}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Tạo mới
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
          <Form.Item
            label="Subject"
            name="subjectName"
            rules={[{ required: true, message: "Please select a subject!" }]}
          >
            <Select
              placeholder="Select a subject"
              onChange={onSubjectChange}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="New subject name"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                    />
                    <Button
                      type="link"
                      onClick={addNewSubject}
                      icon={<PlusOutlined />}
                    >
                      Add
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
            label="Session"
            name="sessionName"
            rules={[{ required: true, message: "Please select a session!" }]}
          >
            <Select
              placeholder="Select a session"
              disabled={!selectedSubject}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="New session name"
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
                      Add
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
            label="Lesson Name"
            name="lessonName"
            rules={[
              { required: true, message: "Please input the lesson name!" },
            ]}
          >
            <Input placeholder="Enter lesson name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
