"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function PropertyValuation() {
  return (
    <div className="bg-light">
      <header className="bg-white py-2">
        <Container>
          <Row className="align-items-center">
            <Col>
              <Image src="/placeholder.svg" alt="MagicBricks Logo" width={150} height={40} />
            </Col>
            <Col className="text-end">
              <Button variant="outline-primary" size="sm">Post Property</Button>
            </Col>
          </Row>
        </Container>
      </header>

      <section className="bg-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-5 fw-bold mb-3">Property Valuation</h1>
              <p className="lead mb-4">Discover the real value of your property</p>
              <p className="text-muted mb-4">Get ₹5 crore to ₹50 lakh for your property</p>
              <Button variant="danger" size="lg">
                Request Valuation <ArrowRight className="ms-2" size={20} />
              </Button>
            </Col>
            <Col md={6}>
              <Image
                src="https://sjc.microlink.io/LbmQ7VRYYcYnvtda4KE27nsnBORO6GiMnEihXV0Rrm2m2ZCAwlQGATWTlesuNsraDfvqKhHPZTufYjbgI8Zm5w.jpeg"
                alt="Property Valuation Illustration"
                width={500}
                height={300}
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h2 className="h4 mb-4">Benefits for Buyers</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Know the right price before making an offer</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Negotiate better with the seller</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h2 className="h4 mb-4">Benefits for Sellers</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Get the right price for your property</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Attract genuine buyers with the right price</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
