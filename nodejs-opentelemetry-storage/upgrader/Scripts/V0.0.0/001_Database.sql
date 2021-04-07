IF (NOT EXISTS (SELECT name
                    FROM master.dbo.sysdatabases
                    WHERE name = 'NodejsOtl'))
BEGIN
    CREATE DATABASE NodejsOtl;
    ALTER DATABASE NodejsOtl
        SET ANSI_NULLS ON,
            ANSI_PADDING ON,
            ANSI_WARNINGS ON,
            ARITHABORT ON,
            CONCAT_NULL_YIELDS_NULL ON,
            NUMERIC_ROUNDABORT OFF,
            QUOTED_IDENTIFIER ON,
            ANSI_NULL_DEFAULT ON,
            CURSOR_DEFAULT LOCAL,
            RECOVERY FULL,
            CURSOR_CLOSE_ON_COMMIT OFF,
            AUTO_CREATE_STATISTICS ON,
            AUTO_SHRINK OFF,
            AUTO_UPDATE_STATISTICS ON,
            RECURSIVE_TRIGGERS OFF
        WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE NodejsOtl
        SET AUTO_CLOSE OFF
        WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE NodejsOtl SET ALLOW_SNAPSHOT_ISOLATION OFF;
    ALTER DATABASE NodejsOtl SET READ_COMMITTED_SNAPSHOT OFF WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE NodejsOtl
        SET AUTO_UPDATE_STATISTICS_ASYNC OFF,
            PAGE_VERIFY NONE,
            DATE_CORRELATION_OPTIMIZATION OFF,
            DISABLE_BROKER,
            PARAMETERIZATION SIMPLE,
            SUPPLEMENTAL_LOGGING OFF
        WITH ROLLBACK IMMEDIATE;
    IF IS_SRVROLEMEMBER(N'sysadmin') = 1
        BEGIN
            IF EXISTS (SELECT 1
                        FROM   [master].[dbo].[sysdatabases]
                        WHERE  [name] = N'NodejsOtl')
                BEGIN
                    EXECUTE sp_executesql N'ALTER DATABASE [NodejsOtl]
        SET TRUSTWORTHY OFF,
            DB_CHAINING OFF
        WITH ROLLBACK IMMEDIATE';
                END
        END
    ELSE
        BEGIN
            PRINT N'The database settings cannot be modified. You must be a SysAdmin to apply these settings.';
        END
    IF IS_SRVROLEMEMBER(N'sysadmin') = 1
        BEGIN
            IF EXISTS (SELECT 1
                        FROM   [master].[dbo].[sysdatabases]
                        WHERE  [name] = N'NodejsOtl')
                BEGIN
                    EXECUTE sp_executesql N'ALTER DATABASE [NodejsOtl]
        SET HONOR_BROKER_PRIORITY OFF
        WITH ROLLBACK IMMEDIATE';
                END
        END
    ELSE
        BEGIN
            PRINT N'The database settings cannot be modified. You must be a SysAdmin to apply these settings.';
        END
    ALTER DATABASE NodejsOtl SET TARGET_RECOVERY_TIME = 0 SECONDS WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE NodejsOtl SET FILESTREAM(NON_TRANSACTED_ACCESS = OFF), CONTAINMENT = NONE WITH ROLLBACK IMMEDIATE;
END
GO
