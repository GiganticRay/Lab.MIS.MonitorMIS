
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/05/2018 07:13:10
-- Generated from EDMX file: D:\Experience_Lab\CQfengjiexianLandslideDebrisFlowGeologicalDisasterDetectionAndWarningSystem\Lab.MIS.MonitorMIS\Lab.MIS.Model\DataModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [MonitorMIS];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[UserInfo]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserInfo];
GO
IF OBJECT_ID(N'[dbo].[PointPicture]', 'U') IS NOT NULL
    DROP TABLE [dbo].[PointPicture];
GO
IF OBJECT_ID(N'[dbo].[DeviceInfo]', 'U') IS NOT NULL
    DROP TABLE [dbo].[DeviceInfo];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'UserInfo'
CREATE TABLE [dbo].[UserInfo] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserName] nvarchar(max)  NOT NULL,
    [UserPwd] nvarchar(max)  NOT NULL,
    [UserAuthority] int  NOT NULL
);
GO

-- Creating table 'PointPicture'
CREATE TABLE [dbo].[PointPicture] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PicPath] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'DeviceInfo'
CREATE TABLE [dbo].[DeviceInfo] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [DeviceName] nvarchar(max)  NOT NULL,
    [ShuCaiNum] nvarchar(max)  NOT NULL,
    [SensorNum] nvarchar(max)  NOT NULL,
    [PhoneNum] nvarchar(max)  NOT NULL,
    [YaoshiNum] nvarchar(max)  NOT NULL,
    [DeviceLon] nvarchar(max)  NOT NULL,
    [DeviceLat] nvarchar(max)  NOT NULL,
    [MonitorType] nvarchar(max)  NOT NULL,
    [MonitorName] nvarchar(max)  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'UserInfo'
ALTER TABLE [dbo].[UserInfo]
ADD CONSTRAINT [PK_UserInfo]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'PointPicture'
ALTER TABLE [dbo].[PointPicture]
ADD CONSTRAINT [PK_PointPicture]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'DeviceInfo'
ALTER TABLE [dbo].[DeviceInfo]
ADD CONSTRAINT [PK_DeviceInfo]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------