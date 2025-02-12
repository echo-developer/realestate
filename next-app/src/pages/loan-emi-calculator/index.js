import { useState } from "react";
import { Container, Row, Col, Form, Button, Table, Card } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [tenure, setTenure] = useState(25);
  const [interestRate, setInterestRate] = useState(10);
  const [emi, setEmi] = useState(72696);
  const [repaymentSchedule, setRepaymentSchedule] = useState([]);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure * 12;
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setEmi(Math.round(emiValue));

    // Generate repayment schedule
    let balance = loanAmount;
    const schedule = [];
    for (let i = 0; i < 6; i++) {
      const interest = balance * monthlyRate;
      const principal = emiValue - interest;
      balance -= principal;

      schedule.push({
        month: `Month ${i + 1}`,
        beginningBalance: Math.round(balance + principal),
        emi: Math.round(emiValue),
        principal: Math.round(principal),
        interest: Math.round(interest),
        outstanding: Math.round(balance),
      });
    }
    setRepaymentSchedule(schedule);
  };

  return (
    <MainLayout>
    <Container className="p-2">
      <Card className="p-4 shadow">
        <h1 className="text-center text-primary">Home Loan EMI Calculator</h1>

        {/* Form Inputs */}
        <Row className="mt-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Loan Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Loan Tenure (years)</Form.Label>
              <Form.Control
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Interest Rate (% p.a.)</Form.Label>
              <Form.Control
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Button */}
        <Button className="mt-4 w-100" variant="primary" onClick={calculateEMI}>
          Recalculate EMI
        </Button>

        {/* EMI Result */}
        <Card className="mt-4 p-4 text-center bg-light">
          <h3>You are Eligible for EMI Amount</h3>
          <h2 className="text-success">₹{emi.toLocaleString()}</h2>

          <Row className="mt-3">
            <Col>
              <p className="text-muted">Principal Amount</p>
              <h5>₹{loanAmount.toLocaleString()}</h5>
            </Col>
            <Col>
              <p className="text-muted">Total Interest</p>
              <h5>₹{(emi * tenure * 12 - loanAmount).toLocaleString()}</h5>
            </Col>
          </Row>
        </Card>

        {/* Top Bank Offers */}
        <h4 className="mt-4">Top Banks Home Loan Offers</h4>
        <Row>
          <Col md={6}>
            <Card className="p-3">
              <h5>Bank of Baroda</h5>
              <p>Base & All; Main Term 30yrs</p>
              <Button variant="link">View</Button>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3">
              <h5>State Bank of India</h5>
              <p>Base & All; Main Term 30yrs</p>
              <Button variant="link">Check Bank Offers</Button>
            </Card>
          </Col>
        </Row>

        {/* Repayment Table */}
        <h4 className="mt-4">Your Repayment Details</h4>
        <Table striped bordered hover responsive className="mt-3">
          <thead className="bg-light">
            <tr>
              <th>Month</th>
              <th>Beginning Balance</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {repaymentSchedule.map((row, index) => (
              <tr key={index}>
                <td>{row.month}</td>
                <td>₹{row.beginningBalance.toLocaleString()}</td>
                <td>₹{row.emi.toLocaleString()}</td>
                <td>₹{row.principal.toLocaleString()}</td>
                <td>₹{row.interest.toLocaleString()}</td>
                <td>₹{row.outstanding.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
    </MainLayout>
  );
};

export default EMICalculator;
