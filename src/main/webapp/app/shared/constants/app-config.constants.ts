export const AUTHORITY_CODE: any = {
  // action
  "action.view": "VIEW",
  "action.receive": "RECEIVE",
  "action.insert": "INSERT",
  "action.update": "UPDATE",
  "action.delete": "DELETE",
  "action.import": "IMPORT",
  "action.export.excel": "EXPORT_EXCEL",
  "action.export.pdf": "EXPORT_PDF",
  "action.export.xml": "EXPORT_XML",
  "action.approval": "APPROVAL",
  "action.active": "ACTIVE",
  "action.deactivate": "DEACTIVATE",
  "action.enable": "ENABLE",
  "action.disable": "DISABLE",
  // resource
  "resource.dmdv_add": "DMDV_ADD", // Popup Thêm mới danh mục đơn vị
  "resource.dmdv_edit": "DMDV_EDIT", // Popup Sửa danh mục đơn vị
  "resource.dmdv_delete": "DMDV_DELETE", // Email Xóa danh mục đơn vị

  "resource.dmnd_add": "DMND_ADD", // Popup Thêm mới danh mục người dùng
  "resource.dmnd_edit": "DMND_EDIT", // Popup Sửa danh mục người dùng
  "resource.dmnd_delete": "DMND_DELETE", // Xóa danh mục người dùng

  "resource.dmnnd_add": "DMNND_ADD", // Popup Thêm mới danh mục nhóm người dùng
  "resource.dmnnd_edit": "DMNND_EDIT", // Sua danh mục nhóm người dùng
  "resource.dmnnd_delete": "DMNND_DELETE", // Popup Xoa danh mục nhóm người dùng
  "resource.dmnnd_permission": "DMNND_PERMISSION", // Popup Phân quyền nhóm người dùng
  "resource.qldt_dmnnd_add_user_pop": "DMNND_POPUP_INSERT", // Popup Thêm người dùng

  "resource.qldt_dmdl_import": "DMDL_IMPORT", // Import danh mục dữ liệu
  "resource.qldt_dmdl_add": "DMDL_ADD", // Thêm mới danh mục dữ liệu
  "resource.qldt_dmdl_edit": "DMDL_EDIT", // Sửa danh mục dữ liệu
  "resource.qldt_dmdl_delete": "DMDL_DELETE", // Xóa danh mục dữ liệu

  "resource.qldt_nldt_import": "QLHSNLDT_IMPORT", // Import hồ sơ năng lực đối tác
  "resource.qldt_nldt_add": "QLHSNLDT_ADD", // Thêm mới hồ sơ năng lực đối tác
  "resource.qldt_nldt_edit": "QLHSNLDT_EDIT", // Sửa hồ sơ năng lực đối tác
  "resource.qldt_nldt_delete": "QLHSNLDT_DELETE", // Xóa hồ sơ năng lực đối tác
  "resource.qldt_nldt_view": "QLHSNLDT_VIEW", // Xem hồ sơ năng lực đối tác

  "resource.qldt_qlda_lkhtn": "QLDA_LKHTN", // Lập kế hoạch thuê ngoài phát triển PM
  "resource.qldt_qlda_import": "QLDA_IMPORT", // Import dự án
  "resource.qldt_qlda_add": "QLDA_ADD", // Thêm mới dự án
  "resource.qldt_qlda_edit": "QLDA_EDIT", // Sửa dự án
  "resource.qldt_qlda_delete": "QLDA_DELETE", // Xóa dự án
  "resource.qldt_qlda_view": "QLDA_VIEW", // Xem dự án

  "resource.qldt_khtn_import": "KHTNPTPM_IMPORT", // Import kế hoạch thuê ngoài phát triển PM
  "resource.qldt_khtn_thd": "KHTNPTPM_THD", // Tạo hợp đồng
  "resource.qldt_khtn_add": "KHTNPTPM_ADD", // Thêm mới kế hoạch thuê ngoài phát triển PM
  "resource.qldt_khtn_edit": "KHTNPTPM_EDIT", // Sửa kế hoạch thuê ngoài phát triển PM
  "resource.qldt_khtn_delete": "KHTNPTPM_DELETE", // Xóa kế hoạch thuê ngoài phát triển PM
  "resource.qldt_khtn_view": "KHTNPTPM_VIEW", // Xem kế hoạch thuê ngoài phát triển PM
  "resource.qldt_khtn_approved": "KHTNPTPM_APPROVED", // Phê duyệt kế hoạch thuê ngoài
  "resource.qldt_khtn_refuse": "KHTNPTPM_REFUSE_TO_APPROVED", // Từ chối kế hoạch thuê ngoài

  "resource.qldt_qlhdtn_import": "QLHDTN_IMPORT", // Import hợp đồng thuê ngoài
  "resource.qldt_qlhdtn_add": "QLHDTN_ADD", // Thêm mới hợp đồng thuê ngoài
  "resource.qldt_qlhdtn_edit": "QLHDTN_EDIT", // Sửa hợp đồng thuê ngoài
  "resource.qldt_qlhdtn_delete": "QLHDTN_DELETE", // Xóa hợp đồng thuê ngoài
  "resource.qldt_qlhdtn_view": "QLHDTN_VIEW", // Xem hợp đồng thuê ngoài

  menu: "menu",

  "menu.qldt_dashboard": "DASHBOARD", // Dashboard

  "menu.qldt_dmht": "DMHT", // Danh muc he thong
  "menu.qldt_dmht_dmdv": "DMDV", // Danh muc don vi
  "menu.qldt_dmht_dmnd": "DMND", // Danh muc nguoi dung
  "menu.qldt_dmht_dmnnd": "DMNND", // Danh muc nhom nguoi dung
  "menu.qldt_dmht_dmdl": "DMDL", // Danh muc du lieu

  "menu.qldt_qlnldt": "QLHSNLDT", // Quan ly nang luc doi tac
  "menu.qldt_qlda": "QLDA", // Quan ly du an
  "menu.qldt_khtn": "KHTNPTPM", // Ke hoach thu ngoai
  "menu.qldt_qlhdtn": "QLHDTN", // QUan ly hop dong thue ngoai

  "menu.qldt_bc": "BC", //Báo cáo
  "menu.qldt_bc_hdtncn": "BCHDTN-CN", //Báo cáo hợp đồng thuê ngoài - công nợ
  "menu.qldt_bc_dsdt": "BCDSDT", //Báo cáo danh sách đối tác
  "menu.qldt_bc_dsda": "BCDSDA", //Báo cáo danh sách dự án
  "menu.qldt_bc_cntdvdt": "BCCNTDV-DA-DT", //Báo cáo công nợ theo đơn vị - dự án - đối tác
  "menu.qldt_bc_thcntdt": "BCTHCNTDT", //Báo cáo tổng hợp công nợ theo đối tác
  "menu.qldt_bc_thcntdv": "BCTHCNTDV", //Báo cáo tổng  hợp công nợ theo đơn vị
  "menu.qldt_bc_tkkhtn": "BCTKKHTN", //Báo cáo thống kê kế hoạch thuê ngoài
  "menu.qldt_bc_qlhdctsd": "BCQLHDCT-SDNLSD", //Báo cáo quản lý hợp đồng chi tiết sử dụng nỗ lực
  "menu.qldt_bc_thcntdvdt": "BCTHTDV-DT", //Báo cáo tổng hợp công nợ theo đơn vị - đối tác
  "menu.qldt_bc_thttcdt": "BCTH-TTDT" //Báo cáo tổng hợp thông tin của đối tác
};
