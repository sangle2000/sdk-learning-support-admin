import { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Subject() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
  ]);
  const [sessions, setSessions] = useState([
    { id: 1, name: "Session 1", subjectId: 1 },
    { id: 2, name: "Session 2", subjectId: 1 },
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [newSession, setNewSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  // Trong component Subject, thêm:
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        message.success("New lesson added successfully!");
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onSubjectChange = (value: number) => {
    setSelectedSubject(value);
    form.setFieldsValue({ session: undefined }); // Reset session when subject changes
  };

  const addNewSubject = () => {
    if (newSubject.trim()) {
      const newId =
        subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
      setSubjects([...subjects, { id: newId, name: newSubject }]);
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
        { id: newId, name: newSession, subjectId: selectedSubject },
      ]);
      setNewSession("");
      message.success("New session added!");
    }
  };

  const filteredSessions = selectedSubject
    ? sessions.filter((session) => session.subjectId === selectedSubject)
    : [];

  return (
    <div style={{ width: "65vw", height: "100vh" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: "1rem", float: "right" }}
      >
        Add New Subject
      </Button>

      <Modal
        title="Add New Lesson"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
          <Form.Item
            label="Subject"
            name="subject"
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
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Session"
            name="session"
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
              {filteredSessions.map((session) => (
                <Option key={session.id} value={session.id}>
                  {session.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Lesson Name"
            name="lesson"
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
