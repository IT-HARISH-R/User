// import api from "./axios";

// const contactServices = {
//     // Create new inquiry (for contact form)
//     Post: async (data) => {
//         try {
//             console.log("contact Data:", data);
//             const res = await api.post("contact/ask/", data);
//             console.log("contact Response:", res);
//             return res;
//         } catch (err) {
//             console.error("contact error:", err);
//             throw err;
//         }
//     },

//     // Get all inquiries
//     getInquiries: async () => {
//         try {
//             const response = await api.get("contact/ask/");
//             return response.data; // Return data directly
//         } catch (error) {
//             console.error('Error fetching inquiries:', error);
//             throw error;
//         }
//     },

//     // Get single inquiry
//     getInquiry: async (id) => {
//         try {
//             const response = await api.get(`contact/ask/${id}/`);
//             return response.data;
//         } catch (error) {
//             console.error('Error fetching inquiry:', error);
//             throw error;
//         }
//     },

//     // Update inquiry status
//     updateInquiryStatus: async (id, data) => {
//         try {
//             const response = await api.patch(`contact/ask/${id}/`, data);
//             return response.data;
//         } catch (error) {
//             console.error('Error updating inquiry:', error);
//             throw error;
//         }
//     },

//     // Delete inquiry
//     deleteInquiry: async (id) => {
//         try {
//             const response = await api.delete(`contact/ask/${id}/`);
//             return response.data;
//         } catch (error) {
//             console.error('Error deleting inquiry:', error);
//             throw error;
//         }
//     },

//     // Mark as replied
//     markAsReplied: async (id) => {
//         try {
//             const response = await api.patch(`contact/ask/${id}/`, {
//                 status: 'replied'
//             });
//             return response.data;
//         } catch (error) {
//             console.error('Error marking as replied:', error);
//             throw error;
//         }
//     },

//     // Archive inquiry
//     archiveInquiry: async (id) => {
//         try {
//             const response = await api.patch(`contact/ask/${id}/`, {
//                 status: 'archived'
//             });
//             return response.data;
//         } catch (error) {
//             console.error('Error archiving inquiry:', error);
//             throw error;
//         }
//     },

//     // Send reply email
//     sendReplyEmail: async (id, data) => {
//         try {
//             const response = await api.post(`contact/ask/${id}/reply/`, data);
//             return response.data;
//         } catch (error) {
//             console.error('Error sending reply email:', error);
//             throw error;
//         }
//     },

//     // Update inquiry status with reply (all in one)
//     updateInquiryWithReply: async (id, status, replyData = null) => {
//         try {
//             const data = { status };
//             if (replyData) {
//                 data.reply_message = replyData.message;
//                 data.email_subject = replyData.subject;
//             }

//             const response = await api.patch(`contact/ask/${id}/`, data);
//             return response.data;
//         } catch (error) {
//             console.error('Error updating inquiry:', error);
//             throw error;
//         }
//     },

//     // Mark as replied and send email
//     markAsRepliedWithEmail: async (id, emailData) => {
//         try {
//             // First send email
//             const emailResponse = await api.post(`contact/ask/${id}/reply/`, emailData);

//             // Then update status
//             const statusResponse = await api.patch(`contact/ask/${id}/`, {
//                 status: 'replied'
//             });

//             return {
//                 email: emailResponse.data,
//                 status: statusResponse.data
//             };
//         } catch (error) {
//             console.error('Error marking as replied:', error);
//             throw error;
//         }
//     }
// };

// export default contactServices;