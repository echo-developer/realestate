import { useState } from "react";
import { Container, Row, Col, Form, Button, Table, Card, FloatingLabel } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(8000000);
  const [tenure, setTenure] = useState(25);
  const [interestRate, setInterestRate] = useState(10);
  const [emi, setEmi] = useState(72696);
  const [repaymentSchedule, setRepaymentSchedule] = useState([]);
const translation = useTranslation();
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
      <section className="section">
        <Container>
          <Row className="mb-3">
            <Col lg={6}>
              <Card className="mb-4">            
                <Card.Body>
                  <h1 className="text-center h3 mb-3">{translation?.home_loan_emi_calculator || 'Home Loan EMI Calculator'}
                  </h1>
                  {/* Form Inputs */}
                  <Row className="gx-3">
                    <Col md={12}>
                      <FloatingLabel label={translation?.loan_amount || 'Loan Amount (₹)'} className="mb-4">
                        <Form.Control
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          placeholder=""
                        />
                      </FloatingLabel>
                    </Col>

                    <Col md={6}>
                      <FloatingLabel label={translation?.loan_tenure_years || 'Loan Tenure (years)'} className="mb-4">
                        <Form.Control
                          type="number"
                          value={tenure}
                          onChange={(e) => setTenure(Number(e.target.value))}
                          placeholder=""
                        />
                      </FloatingLabel>
                    </Col>

                    <Col md={6}>
                      <FloatingLabel label={translation?.interest_rate || 'Interest Rate (% p.a.)'} className="mb-4">
                        <Form.Control
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          placeholder=""
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>

                  {/* Button */}
                  <Button className="w-100" variant="primary" onClick={calculateEMI}>
                  {translation?.recalculate_emi || 'Recalculate EMI'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            {/* EMI Result */}
            <Col lg={6}>
              <Card className="mb-4 text-center bg-light">
                <Card.Body>
                  <h3>{translation?.eligible_emi_amount || 'You are Eligible for EMI Amount'}
                  </h3>
                  <h2 className="text-success mb-3">₹{emi.toLocaleString()}</h2>

                  <Row>
                    <Col xs={12} className="mb-3">
                      <p className="text-muted mb-1">{translation?.principal_amount || 'Principal Amount'}
                      </p>
                      <h4 className="mb-1">₹{loanAmount.toLocaleString()}</h4>
                    </Col>
                    <Col xs={12}>
                      <p className="text-muted mb-1">{translation?.total_interest || 'Total Interest'}</p>
                      <h4>₹{(emi * tenure * 12 - loanAmount).toLocaleString()}</h4>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Top Bank Offers */}
          <h3 className="mb-3">{translation?.top_banks_home_loan_offers || 'Top Banks Home Loan Offers'}
          </h3>
          <Row className="mb-3">
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h4>{translation?.bank_of_baroda || 'Bank of Baroda'}
                  </h4>
                  <p>{translation?.base_all_main_term || 'Base & All; Main Term 30yrs'}
                  </p>
                  <Button variant="outline-primary">{translation?.check_bank_offers || 'Check Bank Offers'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
              <Card.Body>
                <h4>{translation?.state_bank_of_india || 'State Bank of India'}
                </h4>
                <p>{translation?.base_all_main_term || 'Base & All; Main Term 30yrs'}
                </p>
                <Button variant="outline-primary">{translation?.check_bank_offers || 'Check Bank Offers'}
                </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Repayment Table */}
          <h3 className="mb-3">{translation?.your_repayment_details || 'Your Repayment Details'}
          </h3>
          <Table striped bordered hover responsive>
            <thead className="bg-light">
              <tr>
                <th>{translation?.month || 'Month'}
                </th>
                <th>{translation?.beginning_balance || 'Beginning Balance'}
                </th>
                <th>{translation?.emi || 'EMI'}
                </th>
                <th>{translation?.principal || 'Principal'}
                </th>
                <th>{translation?.interest || 'Interest'}
                </th>
                <th>{translation?.outstanding_balance || 'Outstanding Balance'}
                </th>
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
          
        </Container>
      </section>
    </MainLayout>
  );
};

export default EMICalculator;
