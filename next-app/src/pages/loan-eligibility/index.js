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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import LoanDetailsModal from "@/components/addtional/LoanDetailsModal";
import AuthUser from "@/components/Authentication/AuthUser";



const LoanEligibility = () => {
  const { callApi } = AuthUser();
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showloanModal, setShowloanModal] = useState(false);
  const [bankList, setBankList] = useState([]);
  const translation = useTranslation();
  const toggleReadMore = () => {
    setShowMore(!showMore);
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

  useEffect(() => {
    const fetchBankListData = async () => {
      try {
        const res = await callApi({
          api: "/get_bank_details",
          method: "GET",
          data: {}
        })
        if(res && res?.status == 1) {
          setBankList(res?.data || []);
        }
      } catch (error) {
        console.log(error.message || "Something went wrong")
      }
    }
    fetchBankListData();
  }, [])

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate);
    const years = parseFloat(tenure);
  
    if (isNaN(principal) || isNaN(interest) || isNaN(years) || principal <= 0 || interest <= 0 || years <= 0) {
      setEmi(0);
      setTotalAmount(0);
      setInterestAmount(0);
      return;
    }
  
    const ratePerMonth = interest / (12 * 100);
    const tenureInMonths = years * 12;
  
    const emiValue =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureInMonths)) /
      (Math.pow(1 + ratePerMonth, tenureInMonths) - 1);
  
    const totalPayment = emiValue * tenureInMonths;
    const totalInterest = totalPayment - principal;
  
    setEmi(Math.round(emiValue));
    setTotalAmount(Math.round(totalPayment));
    setInterestAmount(Math.round(totalInterest));
  };

  const handleLoadAmountChange = (e) => {
    const value = Number(e.target.value || 0);
    setLoanAmount(value);
  }
  


  const data = [
    { name: `${translation?.principal_amount || "Principal Amount"}`, value: loanAmount },
    { name: `${translation?.principal_amount || "Interest Amount"}`, value: interestAmount },
  ];

  const COLORS = ["#3f51b5", "#4fd1c5"];


  return (
    <MainLayout>
      <div className="container py-4">
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
                        type="text"
                        value={loanAmount}
                        onChange={handleLoadAmountChange}
                        placeholder="Enter loan amount"

                      />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>{translation?.tenure_years || "Tenure (Years)"}</Form.Label>
                      <Form.Select
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                      >
                        <option value="">{translation?.select_tenure || "select tenure"}</option>
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
                onClick={handleShowLoadModal}
              >
                {translation?.get_instant_loan || "Get Instant Loan"}
              </Button>
              {/* <p className="text-center text-muted small">
              {translation?.it_essay_with || "It's easy with Paytm"}
              </p> */}

              <table className="table table-bordered align-middle  mt-3">
                <thead className="bg-light text-dark fw-semibold border-bottom">
                  <tr>
                    <th scope="col" className="py-3 px-3">
                    {translation?.bank_name || "Bank Name"} <i className="bi bi-info-circle"></i>
                    </th>
                    <th scope="col" className="py-3 px-3">
                    {translation?.rate_of_interset || "Rate of Interest"} <i className="bi bi-info-circle"></i>
                    </th>
                    <th scope="col" className="py-3 px-3">
                    {translation?.processing_fees || "Processing fees"} <i className="bi bi-info-circle"></i>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bankList?.length > 0 && bankList?.map((bank, index) => (
                    <tr key={index}>
                      <td className="d-flex align-items-center gap-2">
                        <img src={bank.logo_url} alt={`${bank.bank_name} Logo`} width="30" height="30" />
                        {bank.bank_name}
                      </td>
                      <td>{bank.interest_rate ? `${bank?.interest_rate}% p.a.` : ""}</td>
                      <td>{bank.processing_fees ? `${bank.processing_fees}% of loan amount` : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>



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
              {showMore ? `${translation?.read_less || "Read Less"}` : `${translation?.read_more || "Read More"}`}
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
