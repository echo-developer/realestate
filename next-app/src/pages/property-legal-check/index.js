import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, FloatingLabel } from "react-bootstrap";
import MainLayout from '@/components/layout/MainLayout';
import useTranslation from '@/hooks/useTranslation';
const PropertyLegalCheck = () => {
  const [checks, setChecks] = useState({
    validOwnership: false,
    noPendingLitigation: false,
    clearTitle: false,
    validBuildingPermit: false,
    taxClearance: false,
    noIllegalConstruction: false,
  });
  const translation = useTranslation();
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prevChecks) => ({
      ...prevChecks,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    const result = passedChecks === totalChecks
      ? 'Property is legally clear.'
      : 'Property has legal issues.';
    alert(result);
  };

  return (
    <MainLayout>
      <div className='short-banner text-center'>
        <Container>
          <h1 className="h2">{translation?.property_legal_tick_check || 'Property Legal Tick Check'}
          </h1>
        </Container>
      </div>
      <section className="section">        
        <Container>
          <Row className="justify-content-center">
            <Col lg="auto">
              <Card className="mb-4">
                <Card.Body>
                  <form>
                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="validOwnership"
                        label={translation?.valid_ownership_documents || 'Valid Ownership Documents'}
                        id="legal_check_1"
                        checked={checks.validOwnership}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="noPendingLitigation"
                        label={translation?.no_pending_litigation || 'No Pending Litigation'}
                        id="legal_check_2"
                        checked={checks.noPendingLitigation}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="clearTitle"
                        label={translation?.clear_title || 'Clear Title'}
                        id="legal_check_3"
                        checked={checks.clearTitle}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="validBuildingPermit"
                        label={translation?.valid_building_permit || 'Valid Building Permit'}
                        id="legal_check_4"
                        checked={checks.validBuildingPermit}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="taxClearance"
                        label={translation?.tax_clearance || 'Tax Clearance'}
                        id="legal_check_5"
                        checked={checks.taxClearance}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="noIllegalConstruction"
                        label={translation?.no_illegal_construction || 'No Illegal Construction'}
                        id="legal_check_6"
                        checked={checks.noIllegalConstruction}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                      {translation?.submit || 'Submit'}
                    </button>
                  </form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg="auto">
              <div className="">
                <h4 className='mb-3'>{translation?.legal_check_summary || 'Legal Check Summary'}</h4>
                <ul className='list-unstyled d-flex flex-column gap-3'>
                  <li>{translation?.valid_ownership_documents || 'Valid Ownership Documents'}
                    {checks.validOwnership ? '✔️' : '❌'}</li>
                  <li>{translation?.no_pending_litigation || 'No Pending Litigation'}
                    {checks.noPendingLitigation ? '✔️' : '❌'}</li>
                  <li>{translation?.clear_title || 'Clear Title'}
                    {checks.clearTitle ? '✔️' : '❌'}</li>
                  <li>{translation?.valid_building_permit || 'Valid Building Permit'}
                    {checks.validBuildingPermit ? '✔️' : '❌'}</li>
                  <li>{translation?.tax_clearance || 'Tax Clearance'}
                    {checks.taxClearance ? '✔️' : '❌'}</li>
                  <li>{translation?.no_illegal_construction || 'No Illegal Construction'}
                    {checks.noIllegalConstruction ? '✔️' : '❌'}</li>
                </ul>
              </div>
            </Col>
          </Row>


        </Container>
      </section>
    </MainLayout>
  );
};

export default PropertyLegalCheck;
