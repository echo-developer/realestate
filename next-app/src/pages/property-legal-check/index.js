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
          <Row className="-mb-4 justify-content-center">
            <Col lg="4">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h4 className='mb-3'>{translation?.legal_check || 'Legal Check'}</h4>
                  <form>
                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        name="validOwnership"
                        label={translation?.valid_ownership_documents || 'Valid Ownership Documents'}
                        id="legal_check_1"
                        checked={checks.validOwnership}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        name="noPendingLitigation"
                        label={translation?.no_pending_litigation || 'No Pending Litigation'}
                        id="legal_check_2"
                        checked={checks.noPendingLitigation}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        name="clearTitle"
                        label={translation?.clear_title || 'Clear Title'}
                        id="legal_check_3"
                        checked={checks.clearTitle}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        name="validBuildingPermit"
                        label={translation?.valid_building_permit || 'Valid Building Permit'}
                        id="legal_check_4"
                        checked={checks.validBuildingPermit}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        name="taxClearance"
                        label={translation?.tax_clearance || 'Tax Clearance'}
                        id="legal_check_5"
                        checked={checks.taxClearance}
                        onChange={handleCheckboxChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
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
            <Col lg="4">   
              <Card className="border-0 bg-primary-subtle mb-4 h-100-mb-4">
                <Card.Body>         
                  <h4 className='mb-3'>{translation?.legal_check_summary || 'Legal Check Summary'}</h4>
                  <ul className='list-unstyled d-flex flex-column gap-3'>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.valid_ownership_documents || 'Valid Ownership Documents'}</span>
                      <span className='ps-3'>{checks.validOwnership ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                    </li>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.no_pending_litigation || 'No Pending Litigation'}</span>
                      <span className='ps-3'>{checks.noPendingLitigation ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                      </li>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.clear_title || 'Clear Title'}</span>
                      <span className='ps-3'>{checks.clearTitle ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                      </li>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.valid_building_permit || 'Valid Building Permit'}</span>
                      <span className='ps-3'>{checks.validBuildingPermit ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                    </li>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.tax_clearance || 'Tax Clearance'}</span>
                      <span className='ps-3'>{checks.taxClearance ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                    </li>
                    <li className='d-flex justify-content-between'>
                      <span>{translation?.no_illegal_construction || 'No Illegal Construction'}</span>
                      <span className='ps-3'>{checks.noIllegalConstruction ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</span>
                    </li>
                  </ul>  
                </Card.Body>
              </Card>            
            </Col>
          </Row>


        </Container>
      </section>
    </MainLayout>
  );
};

export default PropertyLegalCheck;
