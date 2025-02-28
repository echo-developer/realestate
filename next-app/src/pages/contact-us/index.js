import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const RealEstateContactForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      phone: '',
      message: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      subject: Yup.string().required('Subject is required'),
      phone: Yup.string().required('Phone number is required'),
      message: Yup.string().required('Message is required')
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      alert('Message sent successfully!');
    }
  });

  return (
    <div className="bg-pink-50 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-md">
          <FaMapMarkerAlt className="text-red-500 text-3xl" />
          <p className="text-red-500 mt-2">123 Real Estate Ave, City</p>
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-md">
          <FaPhoneAlt className="text-red-500 text-3xl" />
          <p className="text-red-500 mt-2">+1 234 567 890</p>
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-md">
          <FaEnvelope className="text-red-500 text-3xl" />
          <p className="text-red-500 mt-2">contact@realestate.com</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.subject}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            className="p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
        </div>
        <textarea
          name="message"
          placeholder="Message"
          className="p-3 border rounded h-28"
          onChange={formik.handleChange}
          value={formik.values.message}
        ></textarea>
        <button type="submit" className="bg-red-500 text-white p-3 rounded">Send</button>
      </form>

      <div className="mt-6">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531662!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f287f3%3A0x2b1b2076f5f3a5e3!2sReal+Estate+Office!5e0!3m2!1sen!2sus!4v1633326639282"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default RealEstateContactForm;
