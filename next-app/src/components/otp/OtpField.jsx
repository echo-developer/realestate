'use client';
import React, { useEffect, useRef, useState } from 'react'
import AuthUser from '../Authentication/AuthUser';
import { toast } from 'react-toastify';

const OtpField = ({setOtpValid, setShowOtpField,  email, setValidatedOtp, setFieldError}) => {
    const { callApi } = AuthUser();
    const inputRef = useRef([]);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpErr, setOtpErr] = useState("");

    useEffect(() => {
        setOtpErr("")
    }, [])

    const handleOtpChange = (i, value) => {
        const newOtp = [...otp];
        newOtp[i] = value;
        setOtp(newOtp);

        if(value && i < otp.length - 1) {
            inputRef.current[i + 1]?.focus();
        } 
        if(newOtp.every((digit) => digit !== "")) {
            handleVerifyOtp(newOtp.join(""));
        }
    }

    const handleVerifyOtp = async (otp) => {
        try {
            const res = await callApi({
                api: `/verify_email`,
                method: "UPLOAD",
                data: {
                  email: email,
                  otp: otp,
                },
              })

              if(res && res?.status == 1) {
                setOtpValid(true);
                setShowOtpField(false);
                if(setValidatedOtp) {
                    setValidatedOtp(otp);
                }
                toast.success("OTP verified successfully")
              } else {
                setOtpErr(res?.message || "")
                setOtp(["", "", "", "", "", ""])
                inputRef.current[0].focus();
              }
        } catch (error) {
            console.error(error?.message || "Something went Wrong")
        }
    }

    return (
        <>
            <div className="d-flex gap-2 justify-content-between mb-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    ref={(el) => inputRef.current[index] = el}
                    inputMode="numeric"
                    maxLength={1}
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                    className="form-control text-center"
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          const prev = document.querySelector(`input[name='otp-${index - 1}']`);
                          if (prev) prev.focus();
                        }
                      }}
                    style={{
                        height: "50px",
                        fontSize: "20px",
                    }}
                />
            ))}

            
        </div>
        {otpErr && (
            <div className="text-danger small mb-3">{otpErr}</div>
        )}
        </>
    )
}

export default OtpField
