import { LucideIcon, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export interface Event {
  id: string;
  name: string;
  date: string; // e.g., "October 26, 2024"
  description: string;
  isUpcoming: boolean;
  posterUrl: string; // Placeholder URL
  summary?: string; // Used for past events
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    name: "Annual Tech Summit 2024",
    date: "November 15, 2024",
    description: "A gathering of innovators and tech enthusiasts discussing the future of AI and sustainable technology. Join us for keynotes, workshops, and networking opportunities.",
    isUpcoming: true,
    posterUrl: "/placeholder.svg",
  },
  {
    id: "e2",
    name: "Cultural Fest: Rhapsody",
    date: "October 26, 2024",
    description: "Celebrate diversity with music, dance, and drama performances from across the campus. Don't miss the grand finale!",
    isUpcoming: true,
    posterUrl: "/placeholder.svg",
  },
  {
    id: "e3",
    name: "Sports Day Finals",
    date: "December 5, 2024",
    description: "Cheer for your favorite teams in the final matches of football, basketball, and athletics. Free entry for all students.",
    isUpcoming: true,
    posterUrl: "/placeholder.svg",
  },
  {
    id: "e4",
    name: "Alumni Meetup 2023",
    date: "December 10, 2023",
    description: "Networking event for graduates. Catch up with old friends and mentors.",
    isUpcoming: false,
    posterUrl: "/placeholder.svg",
    summary: "Successful turnout with over 500 alumni attending. Keynote speech by CEO Jane Doe focused on career growth and mentorship. Photos available in the gallery.",
  },
  {
    id: "e5",
    name: "Hackathon 2023",
    date: "September 1, 2023",
    description: "24-hour coding challenge focused on solving real-world problems using modern web technologies.",
    isUpcoming: false,
    posterUrl: "/placeholder.svg",
    summary: "Winning team developed an innovative waste management solution using IoT sensors. Total prize pool of $5,000 distributed. The event fostered great collaboration.",
  },
];

export interface SocialLink {
    name: string;
    url: string;
    icon: LucideIcon;
}

export const COLLEGE_INFO = {
    name: "Adhiyamaan College of Engineering",
    address: "Hosur, Tamil Nadu 635109",
    phone: "+91 94878 19149",
    email: "hod_cse-cs@adhiyamaan.ac.in",
    workingHours: "Monday to Saturday, 8:30 AM – 4:05 PM",
    socials: [
        { name: "Instagram", url: "#", icon: Instagram },
        { name: "X (Twitter)", url: "#", icon: Twitter },
        { name: "YouTube", url: "#", icon: Youtube },
        { name: "LinkedIn", url: "#", icon: Linkedin },
    ] as SocialLink[]
}