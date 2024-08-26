import React from "react";
import { GrFormView } from "react-icons/gr";
import styles from "../../styling/profilemodal.module.scss"
// export const Modal = ({handleClose}) => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.topbar}>
//         <div className={styles.text1}>User Profile</div>
//         <div onClick={handleClose} className={styles.closebtn}>
//           X
//         </div>
//       </div>
//       <div className={styles.content}>
//         <p>SHAH RUKH KHAN</p>
//         {/* <p>Name : {user.name}</p>
//           <p>Email : {user.email}</p> */}
//       </div>
//     </div>
//   );
// };

const Profilemodal = ({ onClose, onOpen, children, profile }) => {
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div onClick={onOpen} className={styles.viewIcon}>
          <GrFormView/>
        </div>
      )}
      {/* <div className={styles.container}>
        <div className={styles.topbar}>
          <div className={styles.text1}>User Profile</div>
          <div onClick={onClose} className={styles.closebtn}>
            X
          </div>
        </div>
        <div className={styles.content}>
          <p>SHAH RUKH KHAN</p>
          {/* <p>Name : {user.name}</p>
           <p>Email : {user.email}</p> */}
        {/* </div>
      </div> */} 
    </>
  );
};

export default Profilemodal;
