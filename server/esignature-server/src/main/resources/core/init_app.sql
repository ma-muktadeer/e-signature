drop proc if exists init_app
go

create proc init_app
as
begin

	drop table if exists t_user

	CREATE TABLE [dbo].[t_user](

		[id_user_key] [numeric](19, 0) PRIMARY key IDENTITY(100000,1) NOT NULL,
		[id_user_ver] [int] NULL,
		[is_active] [int] NULL,
		[id_client_key] [numeric](19, 0) NULL,
		[id_user_create_key] [numeric](19, 0) NULL,
		[dtt_create] [datetime] NULL,
		[id_user_mod_key] [numeric](19, 0) NULL,
		[dtt_mod] [datetime] NOT NULL,
		[id_event_key] [int] NULL,
		[id_state_key] [int] NULL,
		[id_legal_entity_key] [int] NULL,
		
		[tx_app_name] [varchar](255) NULL,
		[int_allow_login] [int] NULL,
		[tx_country] [varchar](255) NULL,
		[dtt_dob] [datetime] NULL,
		[tx_phone_number] [varchar](255) NULL,
		[tx_email] [varchar](255) NULL,
		[tx_religion] [varchar](255) NULL,

		[tx_first_name] [varchar](255) NULL,
		[tx_middle_name] [varchar](255) NULL,
		[tx_last_name] [varchar](255) NULL,
		[tx_full_name] [varchar](255) NULL,
		

		[tx_gender] [varchar](255) NULL,
		
		[tx_login_name] [varchar](255) NULL,
		[tx_password] [varchar](255) NULL,
		[int_pass_expired] [int] NULL,
		
		[int_two_factor_auth] [int] NULL,
		[tx_verify_code] [varchar](255) NULL,
		[tx_new_pass] [varchar](255) NULL,
		[tx_login_method] [varchar](255) NULL,
		[tx_tmp_pass] [varchar](255) NULL
	)

	INSERT INTO [dbo].[t_user] ([id_user_ver] ,[is_active] ,[id_client_key] ,[id_user_create_key] ,[dtt_create] ,[id_user_mod_key] ,[dtt_mod] ,[id_event_key] ,[id_state_key] ,[tx_app_name] ,[int_allow_login] ,[tx_country] ,[dtt_dob] ,[tx_phone_number] ,[tx_email] ,[tx_first_name] ,[tx_full_name] ,[tx_gender] ,[tx_last_name] ,[tx_login_name] ,[tx_middle_name] ,[int_pass_expired] ,[tx_password] ,[tx_religion] ,[int_two_factor_auth] ,[tx_verify_code] ,[tx_new_pass] ,[tx_tmp_pass]) 
	VALUES
	( 0 ,1 ,100000 ,100000 ,getdate() ,100000 ,getdate() ,100000 ,100000 ,'SYSTEM',1 ,'BANGLADESH',GETDATE() ,'01737575077','mdkamrul220@gmail.com','Kamrul','?','?','?','softcafe','?',0 ,'123','I',0 ,'','','')


	drop table if exists t_role

	CREATE TABLE [dbo].[t_role](
		[id_role_key] [numeric](19, 0) IDENTITY(100000,1) NOT NULL,
		[id_role_ver] [int] NULL,
		[is_active] [int] NULL,
		[tx_desc] [varchar](255) NULL,
		[tx_role_group] [varchar](255) NULL,
		[tx_role_name] [varchar](255) NULL,
		[tx_role_type] [varchar](255) NULL,
		
	PRIMARY KEY CLUSTERED 
	(
		[id_role_key] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]



	INSERT INTO [dbo].[t_role] ([id_role_ver] ,[is_active] ,[tx_desc] ,[tx_role_group] ,[tx_role_name] ,[tx_role_type]) 
	VALUES (0 ,1 ,'BASE_ROLE','APP','SYSTEM_USER','SYSTEM') 

	INSERT INTO [dbo].[t_role] ([id_role_ver] ,[is_active] ,[tx_desc] ,[tx_role_group] ,[tx_role_name] ,[tx_role_type]) 
	VALUES (0 ,1 ,'BASE_ROLE','APP','SUPER_ADMIN','ADMIN') 

	INSERT INTO [dbo].[t_role] ([id_role_ver] ,[is_active] ,[tx_desc] ,[tx_role_group] ,[tx_role_name] ,[tx_role_type]) 
	VALUES (0 ,1 ,'BASE_ROLE','APP','ADMIN','ADMIN') 

	INSERT INTO [dbo].[t_role] ([id_role_ver] ,[is_active] ,[tx_desc] ,[tx_role_group] ,[tx_role_name] ,[tx_role_type]) 
	VALUES (0 ,1 ,'BASE_ROLE','APP','USER','USER') 

	


	drop table if exists t_generic_map


	CREATE TABLE [dbo].[t_generic_map](

		[id_generic_map_key] [int] identity(100000,1) NOT NULL,
		[id_generic_map_ver] [int] NOT NULL,
		[is_active] [int] NULL,
		[id_client_key] [numeric](19, 0) NULL,
		[id_user_create_key] [numeric](19, 0) NULL,
		[dtt_create] [datetime] NULL,
		[id_user_mod_key] [numeric](19, 0) NULL,
		[dtt_mod] [datetime] NOT NULL,
		[id_event_key] [int] NULL,
		[id_state_key] [int] NULL,
		
		tx_from_type_name [varchar](128) NOT NULL,
		[lng_from_id] [int] NOT NULL,
		lng_to_id [int] NOT NULL,
		tx_to_type_name [varchar](256) NOT NULL,
	 CONSTRAINT [pk_generic_map_key] PRIMARY KEY CLUSTERED 
	(
		[id_generic_map_key] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	 CONSTRAINT [const_un_generic_map] UNIQUE NONCLUSTERED 
	(
		[id_client_key] ASC,
		tx_from_type_name ASC,
		[lng_from_id] ASC,
		lng_to_id ASC,
		tx_to_type_name ASC,
		[is_active] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]



	INSERT INTO [dbo].[t_generic_map]
	           ([id_generic_map_ver] ,[is_active] ,[id_client_key] ,[id_user_create_key] ,[dtt_create] ,[id_user_mod_key] ,[dtt_mod] ,[id_event_key] ,[id_state_key] ,tx_from_type_name ,lng_from_id ,lng_to_id ,tx_to_type_name ) 
			   VALUES
	           (0 ,1 ,100000 ,100000 ,getdate() ,100000 ,getdate() ,100000 ,100000 ,'USER',100000 ,100000 ,'ROLE') 


	INSERT INTO [dbo].[t_generic_map]
	           ([id_generic_map_ver] ,[is_active] ,[id_client_key] ,[id_user_create_key] ,[dtt_create] ,[id_user_mod_key] ,[dtt_mod] ,[id_event_key] ,[id_state_key] ,tx_from_type_name ,lng_from_id ,lng_to_id ,tx_to_type_name) 
			   VALUES
	           (0 ,1 ,100000 ,100000 ,getdate() ,100000 ,getdate() ,10000 ,100001 ,'USER',100000 ,100001 ,'ROLE')


	select * from t_user
	select * from t_role
	select * from t_generic_map
end






