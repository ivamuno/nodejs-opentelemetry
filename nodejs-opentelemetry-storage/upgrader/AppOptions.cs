// -----------------------------------------------------------------------
// <copyright file="AppOptions.cs" company="Payvision">
// Copyright (c) Payvision. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
namespace Database
{
    using System;
    using System.Linq;

    internal class AppOptions
    {
        public const string ConnectionStringArgKey = "-c";
        public const string EnvArgKey = "-e";
        public const string VersionArgKey = "-v";
        public const string NoCheckConnectionKey = "-nc";

        public const string EnvEnvVarName = "ENVIRONMENT";
        public const string VersionEnvVarName = "INITIAL_VERSION";

        private const string DefaultEnv ="Local";
        private const string DefaultInitialVersion = "0.0.0";


        public AppOptions(string[] args)
        {
            this.LoadFromArgs(args);
            this.LoadFromEnvVars();
        }

        public string ConnectionString { get; set; } = "";
        public string Env { get; set; } = DefaultEnv;
        public Version InitialVersion { get; set; } = Version.Parse(DefaultInitialVersion);

        /// <inheritdoc />
        public override string ToString() =>
            $"{nameof(this.ConnectionString)}:{this.ConnectionString.Split(";").ElementAtOrDefault(2)},{nameof(this.Env)}:{this.Env},{nameof(this.InitialVersion)}:{this.InitialVersion}";

        private bool GetConnectionEnvVars()
        {
          return !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_HOST"))
            && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_PORT"))
            && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_NAME"))
            && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_USER"))
            && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_PASS"))
            && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DB_APP_NAME"));
        }
        private void LoadFromEnvVars()
        {
            if (this.GetConnectionEnvVars())
            {
              string DbHost = Environment.GetEnvironmentVariable("DB_HOST");
              string DbPort = Environment.GetEnvironmentVariable("DB_PORT");
              string DbName = Environment.GetEnvironmentVariable("DB_NAME");
              string DbUser = Environment.GetEnvironmentVariable("DB_USER");
              string DbPass = Environment.GetEnvironmentVariable("DB_PASS");
              string DbAppName = Environment.GetEnvironmentVariable("DB_APP_NAME");
              this.ConnectionString = "Server=" + DbHost + "," + DbPort + ";Database=" + DbName + ";User Id=" + DbUser + ";Password=" + DbPass + ";Application Name=" + DbAppName;
            }

            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable(EnvEnvVarName)))
            {
                this.Env = Environment.GetEnvironmentVariable(EnvEnvVarName);
            }

            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable(VersionEnvVarName)))
            {
                if (Version.TryParse(Environment.GetEnvironmentVariable(VersionEnvVarName), out Version initialVersion))
                {
                    this.InitialVersion = initialVersion;
                }
            }
        }

        private void LoadFromArgs(string[] args)
        {
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == ConnectionStringArgKey && !string.IsNullOrEmpty(args.ElementAtOrDefault(++i)))
                {
                    this.ConnectionString = args.ElementAtOrDefault(i);
                }

                if (args[i] == EnvArgKey && !string.IsNullOrEmpty(args.ElementAtOrDefault(++i)))
                {
                    this.Env = args.ElementAtOrDefault(i);
                }

                if (args[i] == VersionArgKey && !string.IsNullOrEmpty(args.ElementAtOrDefault(++i)))
                {
                    if (Version.TryParse(args.ElementAtOrDefault(i), out Version initialVersion))
                    {
                        this.InitialVersion = initialVersion;
                    }
                }
            }
        }
    }
}
