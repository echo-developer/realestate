'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { People, House, HouseAddFill, Person, Search } from 'react-bootstrap-icons';

export default function MobileFooter() {
  const pathname = usePathname();

  // Check for both property-details and project-details routes
  const isDetailsPage = pathname.startsWith('/property-details') || pathname.startsWith('/project-details');

  if (isDetailsPage) {
    return (
      <footer className="small-footer special-footer">
        <ul>
          <li><Link href="/" className=''><House color="current" size={20} /> Home</Link></li>
          <li><Link href="/property-listing" className=''><Search color="current" size={20} /> Search</Link></li>
          {/* Add more if needed */}
        </ul>
      </footer>
    );
  }

  return (
    <footer className="small-footer">
      <ul>
        <li><Link href="/" className=''><House color="current" size={20} /> Home</Link></li>
        <li><Link href="/property-listing" className=''><Search color="current" size={20} /> Search</Link></li>
        <li><Link href="/postproperty" className='postAd-btn'><HouseAddFill color="white" size={32} /></Link></li>
        <li><Link href="/agent-list" className=''><People color="current" size={20} /> Agents</Link></li>
        <li><Link href="/dashboard" className=''><Person color="current" size={20} /> You</Link></li>
      </ul>
    </footer>
  );
}
