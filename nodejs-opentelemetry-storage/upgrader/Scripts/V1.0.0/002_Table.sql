
USE [NodejsOtl]
GO


IF NOT EXISTS (SELECT * FROM SYSOBJECTS WHERE NAME='Event' AND XTYPE='U')
BEGIN
  PRINT N'Creating [EventStore].[Event]...';	

	CREATE TABLE [EventStore].[Event](
		[Id] [bigint] IDENTITY(1,1) NOT NULL,
		[CorrelationId] [nvarchar](36) NULL,
		[TimeStamp] [datetime2](7) NOT NULL,
		[Data] [nvarchar](max) NULL,
		CONSTRAINT [PK_EventStore_Event_Id] PRIMARY KEY NONCLUSTERED 
	(
		[Id] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

CREATE UNIQUE CLUSTERED INDEX IX_Clustered_EventStore_Event ON [EventStore].[Event] (Id)
GO