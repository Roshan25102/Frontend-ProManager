import emailIcon from "./emailIcon.svg";
import password from "./password.svg";
import openEye from "./openEye.svg";
import closeEye from "./closeEye.svg";
import baground from "./baground.png";
import name from "./name.svg";
import logo from "./logo.svg";
import logout from "./logout.svg";
import board from "./board.svg";
import settings from "./settings.svg";
import analytics from "./analytics.svg";
import people from "./people.svg";
import downArrow from "./downArrow.svg";
import collabs from "./collabs.svg";
import plus from "./plus.svg";
import threeDot from "./threeDot.svg";
import dropdownarrow from "./dropdownarrow.svg";
import star from "./star.svg";
import cancel from "./cancel.svg";
export const assets = {
  emailIcon,
  password,
  openEye,
  closeEye,
  baground,
  name,
  logo,
  board,
  settings,
  analytics,
  logout,
  people,
  downArrow,
  collabs,
  plus,
  threeDot,
  dropdownarrow,
  star,
  cancel,
};
export const progressStages = ["Backlog", "To do", "In progress", "Done"];
export const cardData = [
  {
    progress: "To do",
    priority: "Low",
    initials: "JD",
    title: "Hero section",
    dueDate: "Feb 10th",
    checklist: [
      { task: "Design layout", completed: false },
      { task: "Implement hero image", completed: false },
      { task: "Add headline text", completed: false },
    ],
  },
  {
    progress: "In progress",
    priority: "High",
    initials: "AK",
    title: "Footer section",
    dueDate: "Mar 5th",
    checklist: [
      { task: "Add contact info", completed: true },
      { task: "Social media icons", completed: false },
      { task: "Terms & conditions link", completed: false },
    ],
  },
  {
    progress: "Backlog",
    priority: "Medium",
    initials: "SM",
    title: "Navigation bar",
    dueDate: "Jan 22nd",
    checklist: [
      { task: "Logo placement", completed: true },
      { task: "Add menu links", completed: false },
      { task: "Dropdown functionality", completed: false },
    ],
  },
  {
    progress: "Done",
    priority: "High",
    initials: "LN",
    title: "Product page",
    dueDate: "Mar 15th",
    checklist: [
      { task: "Display product images", completed: false },
      { task: "Add product description", completed: true },
      { task: "Price section", completed: false },
    ],
  },
  {
    progress: "To do",
    priority: "Low",
    initials: "RB",
    title: "Contact Form",
    dueDate: "Feb 25th",
    checklist: [
      { task: "Form validation", completed: false },
      { task: "Style input fields", completed: false },
      { task: "Add submit button", completed: true },
    ],
  },
  {
    progress: "In progress",
    priority: "Medium",
    initials: "PG",
    title: "Blog Post Layout",
    dueDate: "Mar 1st",
    checklist: [
      { task: "Setup CMS", completed: true },
      { task: "Create blog template", completed: false },
      { task: "Add share buttons", completed: false },
    ],
  },
];
