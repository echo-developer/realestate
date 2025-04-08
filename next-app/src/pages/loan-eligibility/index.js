"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  InputGroup,
  Button,
  Row,
  Col,
  Table,
  Image,
  Card,
  Accordion,
} from "react-bootstrap";
import { Search, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import LoanDetailsModal from "@/components/addtional/LoanDetailsModal";

const banks = [
  {
    id: 1,
    name: "State Bank of India",
    logo: "/assets/images/bank/sbi.png",
    interestRate: "7.55%",
    processingFee: "+10,000",
    emi: "25,689",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 2,
    name: "HDFC",
    logo: "/assets/images/bank/hdfc.png",
    interestRate: "8.50%",
    processingFee: "+3,000",
    emi: "37,195",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 3,
    name: "Citibank Housing Loan",
    logo: "/assets/images/bank/citibank.png",
    interestRate: "6.90%",
    processingFee: "+5,000",
    emi: "34,678",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 4,
    name: "SBI Home Loan",
    logo: "/assets/images/bank/sbi-home.png",
    interestRate: "6.80%",
    processingFee: "+10,000",
    emi: "34,524",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 5,
    name: "ICICI Bank",
    logo: "/assets/images/bank/bank-5.png",
    interestRate: "6.80%",
    processingFee: "+7,500",
    emi: "34,524",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 6,
    name: "Axis Bank",
    logo: "/assets/images/bank/axis-bank-logo.png",
    interestRate: "6.90%",
    processingFee: "+10,000",
    emi: "34,678",
    tenure: "90 LAKH TO 30 CRORE",
  },
  {
    id: 7,
    name: "PNB Housing Finance",
    logo: "/assets/images/bank/pnb.png",
    interestRate: "9.25%",
    processingFee: "+10,000",
    emi: "38,409",
    tenure: "90 LAKH TO 30 CRORE",
  },
];

const LoanEligibility = () => {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showloanModal, setShowloanModal] = useState(false);
const translation = useTranslation();
  const toggleReadMore = () => {
    setShowMore(!showMore);
  };

  const handleShowOffer = () => {
    setShowOffer(true);
  };

  const handleShowLoadModal = () => {
    setShowloanModal(true);
  };
  const handleCloseLoadModal = () => {
    setShowloanModal(false);
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, tenure, interestRate]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / (12 * 100);
    const tenureInMonths = tenure * 12;

    const emiValue =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureInMonths)) /
      (Math.pow(1 + ratePerMonth, tenureInMonths) - 1);

    const totalPayment = emiValue * tenureInMonths;
    const totalInterest = totalPayment - principal;

    setEmi(Math.round(emiValue));
    setTotalAmount(Math.round(totalPayment));
    setInterestAmount(Math.round(totalInterest));
  };

  const data = [
    { name: `${translation?.principal_amount || "Principal Amount"}`, value: loanAmount },
    { name:  `${translation?.principal_amount || "Interest Amount"}`, value: interestAmount },
  ];

  const COLORS = ["#3f51b5", "#4fd1c5"];

  const principalPercentage = Math.round((loanAmount / totalAmount) * 100);
  const interestPercentage = Math.round((interestAmount / totalAmount) * 100);

  return (
    <MainLayout>
      <div className="container py-4">
        <h1 className="text-center mb-4">
          {translation?.hii_we_have_offers || "Hi! We have 7 offers for you to compare and choose the best"}
        </h1>

        <div className="bg-light p-3 rounded">
          <Form>
            <Row className="align-items-center">
              <Col xs={12} md={6} className="mb-2 mb-md-0">
                <InputGroup>
                  <Form.Control placeholder={translation?.search || "Search"}aria-label="Search" />
                  <Button variant="outline-secondary">
                    <Search size={16} />
                  </Button>
                </InputGroup>
              </Col>
              <Col xs={6} md={3} className="mb-2 mb-md-0">
                <Form.Select aria-label="Loan amount">
                  <option>₹30,00,000</option>
                  <option>₹20,00,000</option>
                  <option>₹40,00,000</option>
                </Form.Select>
              </Col>
              <Col xs={6} md={3}>
                <Form.Select aria-label="EMI Months">
                  <option> {translation?.months || "240 Months"}</option>
                  <option>{translation?.months || "180 Months"}</option>
                  <option>{translation?.months || "300 Months"}</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </div>

        {showOffer && (
          <div className="table-responsive">
            <Table bordered hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>
                  {translation?.bank_name || "Bank Name"}  <Info size={14} className="ms-1" />
                  </th>
                  <th>
                  {translation?.rate_of_interset || "Rate of Interest"} <Info size={14} className="ms-1" />
                  </th>
                  <th>
                  {translation?.processing_fees || "Processing fees"} <Info size={14} className="ms-1" />
                  </th>
                  <th>
                  {translation?.emi || "EMI"} <Info size={14} className="ms-1" />
                  </th>
                  <th>
                  {translation?.max_loan_amount || "Max loan amount"}<Info size={14} className="ms-1" />
                  </th>
                  <th>{translation?.action || "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image
                          src={bank.logo || "/placeholder.svg"}
                          alt={bank.name}
                          width={40}
                          height={40}
                          className="me-2"
                        />
                        <span>{bank.name}</span>
                      </div>
                    </td>
                    <td>{bank.interestRate}</td>
                    <td>{bank.processingFee}</td>
                    <td>{bank.emi}</td>
                    <td>{bank.tenure}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={handleShowLoadModal}>
                      {translation?.get_one_like_deal || "Get one like deal"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <Card className="border p-4">
          <Card.Title className="mb-3">
          {translation?.calulation_emi_for || "Calculate EMI for the loan amount you require"}
          </Card.Title>
          <Card.Subtitle className="mb-4 text-muted">
          </Card.Subtitle>

          <Row>
            <Col md={6} className="mb-4">
              <Form>
                <Form.Group className="mb-3">
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>{translation?.loan_amount || "Loan Amount"}</Form.Label>
                      <Form.Control
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                      />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>{translation?.tenure_years || "Tenure (Years)"}</Form.Label>
                      <Form.Select
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{translation?.interset_rate || "Interest Rate (%)"}</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </Form.Group>
              </Form>

              <div className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Col>

            <Col md={6} className="d-flex flex-column justify-content-center">
              <div className="text-center mb-4">
                <p className="text-muted mb-1">{translation?.monthly_emi || "Monthly EMI"}</p>
                <h2 className="mb-0">₹ {emi.toLocaleString("en-IN")}</h2>
              </div>

              <div className="text-center mb-4">
                <p className="text-muted mb-1">{translation?.total_payalble_amount || "Total Payable Amount"}</p>
                <h4 className="mb-0">
                  ₹ {totalAmount.toLocaleString("en-IN")}
                </h4>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="mb-2"
                onClick={handleShowOffer}
              >
                {translation?.get_instant_loan || "Get Instant Loan"}
              </Button>
              <p className="text-center text-muted small">
              {translation?.it_essay_with || "It's easy with Paytm"}
              </p>

              <div className="mt-3 p-3 bg-light rounded">
                <div className="d-flex justify-content-between mb-2">
                  <span>{translation?.principal_amount || "Principal Amount"}</span>
                  <span>₹ {loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>{translation?.interset_amount || "Interest Amount"}</span>
                  <span>₹ {interestAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <div className="mt-3">
          <h2 className="mb-3">{translation?.about_emi_calculator || "About EMI Calculator"}</h2>
          <p className="text-muted">
          {translation?.emil_form_a_bank || "EMI from a bank provides a value for loan customers."}
          </p>

          <p>
          {translation?.description_a_loan_emi || "A home loan EMI calculator helps compute the monthly installments that a borrower needs to pay against the total amount availed. Such a tool assists you in making an informed decision about the outflow towards the home loan every month."}
          </p>

          {showMore && (
            <>
              <p>
                {translation?.description_it_factor || "This helps with budgeting and understanding the long-term financial commitment before applying for a loan."}
              </p>
              <p>
                
              </p>
            </>
          )}

          <p>
            <button
              onClick={toggleReadMore}
              className="btn btn-link text-decoration-none p-0"
            >
              {showMore ?  `${translation?.read_less || "Read Less"}` : `${translation?.read_more || "Read More"}`}
            </button>
          </p>
        </div>
        <div className="mt-3">
          <h2 className="mb-3">
          {translation?.frequently_asked_question || "Frequently asked questions about EMI Calculator"}
          </h2>

          <Accordion defaultActiveKey="0" className="mt-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header> {translation?.what_is_an_emai || "What is an EMI?"}</Accordion.Header>
              <Accordion.Body>
              {translation?.description_emai_stand || "EMI stands for Equated Monthly Installment. It's the amount payable every month to the bank or any other financial institution until the loan amount is fully paid off. It consists of the interest on loan as well as part of the principal amount to be repaid."}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>{translation?.how_is_emi_calculator || "How is EMI calculated?"}</Accordion.Header>
              <Accordion.Body>
              {translation?.description_the_mathmatcial || "The mathematical formula to calculate EMI is: EMI = [P x R x(1+R)^N]/[(1+R)^N-1], where P stands for the loan amount orprincipal, R is the interest rate per month, and N is the numberof monthly installments."}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>{translation?.what_factor_affect || "What factors affect my EMI?"}</Accordion.Header>
              <Accordion.Body>
              {translation?.description_the_main || "The main factors that affect your EMI are the loan amount,interest rate, and loan tenure. A higher loan amount or interestrate will increase your EMI, while a longer loan tenure willdecrease it (but increase the total interest paid)."}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      {showloanModal && (
        <LoanDetailsModal
          show={showloanModal}
          handleClose={handleCloseLoadModal}
        />
      )}
    </MainLayout>
  );
};

export default LoanEligibility;
