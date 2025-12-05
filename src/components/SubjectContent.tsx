import { Card, Row, Col, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import type { ISessions, ISubjects } from './Subject';
import { capitalize } from '../utils/helper';

const { Title, Text } = Typography;
const { Option } = Select;

interface ILesson {
    id: number;
    lessonName: string;
    sessionName: string;
    subjectName: string;
    priority: 'high' | 'medium' | 'low';
}

const priorityColors = {
    high: '#ff4d4f',    // Red for high priority
    medium: '#faad14',  // Yellow for medium priority
    low: '#52c41a'      // Green for low priority
};

const LessonCard: React.FC<ILesson> = ({ lessonName, sessionName, subjectName, priority }) => (
    <Card
        hoverable
        style={{
            marginBottom: 16,
            borderRadius: 8,
            position: 'relative',
            overflow: 'visible'
        }}
        bodyStyle={{
            padding: '16px',
            paddingBottom: '32px' // Keep space for the priority dot
        }}
    >
        <div>
            <div
                style={{
                    marginBottom: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    position: 'relative'
                }}
                title={lessonName} // This will show the full title on hover
            >
                <Title
                    level={5}
                    style={{
                        margin: 0,
                        display: 'inline',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {lessonName}
                </Title>
            </div>
            <div
                style={{
                    marginBottom: 12,
                }}
            >
                <div>
                    <Text type="secondary">{sessionName}</Text>
                </div>
                <div>
                    <Text type="secondary">{subjectName}</Text>
                </div>
            </div>
        </div>
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'absolute',
                bottom: 8,
                right: 8,
            }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    {capitalize(priority)}
                </Text>
                <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: priorityColors[priority],
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                    flexShrink: 0
                }} />
            </div>
        </div>
    </Card>
);

const SubjectContent: React.FC = () => {
    const [subjects, setSubjects] = useState<ISubjects[]>([]);
    const [sessions, setSessions] = useState<ISessions[]>([]);
    const [lessons, setLessons] = useState<ILesson[]>([])

    useEffect(() => {
        const fetchSubjects = async () => {
            const response = await api.get('/academics/subjects')
            setSubjects(response.data)
        }

        fetchSubjects()
    }, [])

    const handleChangeSubject = async (value: string) => {
        const response = await api.get(`/academics/session?subjectId=${value}`)

        setSessions(response.data)
    }

    const handleChangeSession = async (value: string) => {
        const response = await api.get(`/academics/lesson?sessionId=${value}`)
        console.log(response.data)

        setLessons(response.data)
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} justify="end">
                    <Col>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Chọn môn học"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={handleChangeSubject}
                        >
                            {subjects.map(subject => (
                                <Option key={subject.id} value={subject.id}>{subject.subjectName}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Chọn buổi học"
                            optionFilterProp="children"
                            onChange={handleChangeSession}
                            filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {sessions.map(session => (
                                <Option key={session.id} value={session.id}>{session.sessionName}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>

            <Row gutter={[16, 16]}>
                {lessons.map(lesson => (
                    <Col xs={24} sm={12} md={8} lg={6} key={lesson.id}>
                        <LessonCard
                            id={lesson.id}
                            lessonName={lesson.lessonName}
                            sessionName={lesson.sessionName}
                            subjectName={lesson.subjectName}
                            priority={lesson.priority}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SubjectContent;
