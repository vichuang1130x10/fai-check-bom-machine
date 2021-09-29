import React from 'react'
import { Card } from 'react-bootstrap'
import Dropzone from './Dropzone'
import './Card.css'

export default function DragCard({ title, fileType, callback }) {
    return (
        <Card className="card">
            <Card.Body>
                <Card.Title className="font-weight-bold">{title}</Card.Title>
                <Dropzone
                    fileType={fileType}
                    callback={callback}
                    title={title}
                />
            </Card.Body>
        </Card>
    )
}
