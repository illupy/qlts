USE qlts;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'bul', 'user') DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_code VARCHAR(6) NOT NULL UNIQUE,         -- Mã nhóm
  group_name VARCHAR(50) NOT NULL UNIQUE,               -- Tên nhóm
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active', -- Trạng thái
  note TEXT,                                     -- Ghi chú
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL         -- Soft delete
);

CREATE TABLE asset_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_code VARCHAR(10) NOT NULL UNIQUE,   -- Mã loại tài sản
  type_name VARCHAR(50) NOT NULL UNIQUE,          -- Tên loại tài sản
  group_id INT NOT NULL,                   -- Nhóm tài sản (FK)
  management_type ENUM('quantity', 'code') NOT NULL DEFAULT 'quantity',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  note TEXT,                               -- Ghi chú
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,         -- Soft delete

  CONSTRAINT fk_asset_type_group FOREIGN KEY (group_id)
    REFERENCES asset_groups(id)
    ON DELETE CASCADE
);
CREATE TABLE asset_flows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  flow_code VARCHAR(6) NOT NULL UNIQUE,     -- Mã dòng tài sản
  flow_name VARCHAR(50) NOT NULL UNIQUE,           -- Tên dòng tài sản
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  note TEXT,                             -- Ghi chú
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL
);
CREATE TABLE units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, 

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);
CREATE TABLE partners (
  id INT AUTO_INCREMENT PRIMARY KEY,

  code VARCHAR(20) NOT NULL UNIQUE,    -- Mã đối tác
  name VARCHAR(50) NOT NULL UNIQUE,    -- Tên đối tác

  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,

  product_code VARCHAR(10) NOT NULL UNIQUE,                -- Mã hàng hóa/dịch vụ (VD: HHDV000001)
  product_name VARCHAR(255) NOT NULL UNIQUE,                      -- Tên hàng hóa/dịch vụ

  product_type ENUM('product', 'service') DEFAULT 'product',  -- Loại hàng hóa/dịch vụ
  product_group ENUM(
    'telecommunications', 'IT', 'RD', 'fixedasset',
    'buildindorinfras', 'other'
),
  asset_type_id INT NOT NULL,         
  asset_flow_id INT NOT NULL,                  

  unit_id INT NOT NULL,                -- Liên kết bảng đơn vị tính

  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  note TEXT,                           -- Ghi chú

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,


  FOREIGN KEY (asset_type_id) REFERENCES asset_types(id),
  FOREIGN KEY (asset_flow_id) REFERENCES asset_flows(id),
  FOREIGN KEY (unit_id) REFERENCES units(id)
);
CREATE TABLE partner_supplier (
  product_id INT NOT NULL,
  partner_id INT NOT NULL,

  PRIMARY KEY (product_id, partner_id),

  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (partner_id) REFERENCES partners(id) 
);

-- insert  user 
INSERT INTO users (full_name, email, password, role) VALUES ('User1', 'user1@example.com', 'hashedpass1', 'admin');
INSERT INTO users (full_name, email, password, role) VALUES ('User2', 'user2@example.com', 'hashedpass2', 'bul');
INSERT INTO users (full_name, email, password, role) VALUES ('User3', 'user3@example.com', 'hashedpass3', 'user');
INSERT INTO users (full_name, email, password, role) VALUES ('User4', 'user4@example.com', 'hashedpass4', 'user');
INSERT INTO users (full_name, email, password, role) VALUES ('User5', 'user5@example.com', 'hashedpass5', 'bul');

--
INSERT INTO asset_groups (group_code, group_name, status, note) VALUES ('AG001', 'Group 1', 'active', 'Note for group 1');
INSERT INTO asset_groups (group_code, group_name, status, note) VALUES ('AG002', 'Group 2', 'active', 'Note for group 2');
INSERT INTO asset_groups (group_code, group_name, status, note) VALUES ('AG003', 'Group 3', 'active', 'Note for group 3');
INSERT INTO asset_groups (group_code, group_name, status, note) VALUES ('AG004', 'Group 4', 'active', 'Note for group 4');
INSERT INTO asset_groups (group_code, group_name, status, note) VALUES ('AG005', 'Group 5', 'active', 'Note for group 5');

--
INSERT INTO asset_types (type_code, type_name, group_id, management_type, status, note) VALUES ('AT001', 'Type 1', 1, 'quantity', 'active', 'Note for type 1');
INSERT INTO asset_types (type_code, type_name, group_id, management_type, status, note) VALUES ('AT002', 'Type 2', 2, 'quantity', 'active', 'Note for type 2');
INSERT INTO asset_types (type_code, type_name, group_id, management_type, status, note) VALUES ('AT003', 'Type 3', 3, 'quantity', 'active', 'Note for type 3');
INSERT INTO asset_types (type_code, type_name, group_id, management_type, status, note) VALUES ('AT004', 'Type 4', 4, 'quantity', 'active', 'Note for type 4');
INSERT INTO asset_types (type_code, type_name, group_id, management_type, status, note) VALUES ('AT005', 'Type 5', 5, 'quantity', 'active', 'Note for type 5');
--
INSERT INTO asset_flows (flow_code, flow_name, status, note) VALUES ('AF001', 'Flow 1', 'active', 'Note for flow 1');
INSERT INTO asset_flows (flow_code, flow_name, status, note) VALUES ('AF002', 'Flow 2', 'active', 'Note for flow 2');
INSERT INTO asset_flows (flow_code, flow_name, status, note) VALUES ('AF003', 'Flow 3', 'active', 'Note for flow 3');
INSERT INTO asset_flows (flow_code, flow_name, status, note) VALUES ('AF004', 'Flow 4', 'active', 'Note for flow 4');
INSERT INTO asset_flows (flow_code, flow_name, status, note) VALUES ('AF005', 'Flow 5', 'active', 'Note for flow 5');
--
INSERT INTO units (name) VALUES ('Unit 1');
INSERT INTO units (name) VALUES ('Unit 2');
INSERT INTO units (name) VALUES ('Unit 3');
INSERT INTO units (name) VALUES ('Unit 4');
INSERT INTO units (name) VALUES ('Unit 5');

--
INSERT INTO partners (code, name, status, note) VALUES ('P001', 'Partner 1', 'active', 'Note for partner 1');
INSERT INTO partners (code, name, status, note) VALUES ('P002', 'Partner 2', 'active', 'Note for partner 2');
INSERT INTO partners (code, name, status, note) VALUES ('P003', 'Partner 3', 'active', 'Note for partner 3');
INSERT INTO partners (code, name, status, note) VALUES ('P004', 'Partner 4', 'active', 'Note for partner 4');
INSERT INTO partners (code, name, status, note) VALUES ('P005', 'Partner 5', 'active', 'Note for partner 5');
--
INSERT INTO products (
  product_code, product_name, product_type, product_group,
  asset_type_id, asset_flow_id, unit_id, suppliers, status, note
) VALUES (
  'HHDV000001', 'Product 1', 'product', 'telecommunications', 1, 1, 1, '[1,2]', 'active', 'Note for product 1'
);
INSERT INTO products (
  product_code, product_name, product_type, product_group,
  asset_type_id, asset_flow_id, unit_id, status, note
) VALUES (
  'HHDV000002', 'Product 2', 'service', 'IT', 2, 2, 2, 'active', 'Note for product 2'
);
INSERT INTO products (
  product_code, product_name, product_type, product_group,
  asset_type_id, asset_flow_id, unit_id, suppliers, status, note
) VALUES (
  'HHDV000003', 'Product 3', 'product', 'RD', 3, 3, 3, 'active', 'Note for product 3'
);
INSERT INTO products (
  product_code, product_name, product_type, product_group,
  asset_type_id, asset_flow_id, unit_id, suppliers, status, note
) VALUES (
  'HHDV000004', 'Product 4', 'service', 'fixedasset', 4, 4, 4, 'active', 'Note for product 4'
);
INSERT INTO products (
  product_code, product_name, product_type, product_group,
  asset_type_id, asset_flow_id, unit_id, suppliers, status, note
) VALUES (
  'HHDV000005', 'Product 5', 'product', 'buildindorinfras', 5, 5, 5, 'active', 'Note for product 5'
);

