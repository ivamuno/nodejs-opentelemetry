// -----------------------------------------------------------------------
// <copyright file="Program.cs" company="Payvision">
//     Payvision Copyright © 2019
// </copyright>
// -----------------------------------------------------------------------
namespace Database
{
    using System;
    using System.Data.SqlClient;
    using System.Globalization;
    using System.Linq;
    using System.Reflection;
    using System.Text.RegularExpressions;
    using System.Threading;
    using DbUp;
    using DbUp.Engine;

    public static class Program
   {
        const int ConnectionTimeOutForCheck = 5;

        static int Main(string[] args)
        {         
            var options = new AppOptions(args);
            int result = 0;         

            if (options.Env == "local" || options.Env == "dev") {
                Console.WriteLine($"Checking the connection to database server with args {options}");
                Thread.Sleep(15000);
            }

            if (result == 0)
            {
                Console.WriteLine($"Updating DB Storage with args {options}");

                result = ExecuteDbUp(options);
            } else
            {
                Console.WriteLine($"The system can not update database for It is not have a connection with the server.");
            }

            return result;
        }

        private static int ExecuteDbUp(AppOptions options)
        {
            EnsureDatabase.For.SqlDatabase(options.ConnectionString);
            UpgradeEngine upgrader = DeployChanges.To
                .SqlDatabase(options.ConnectionString)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly(), file => IsValidFileForEnvironment(file, options.Env) && IsValidVersion(file, options.InitialVersion))
                .WithTransaction()
                .LogToConsole()
                .Build();

            DatabaseUpgradeResult result = upgrader.PerformUpgrade();
            if (!result.Successful)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(result.Error);
                Console.ResetColor();
                return -1;
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Success!");
            Console.ResetColor();

            if (System.Diagnostics.Debugger.IsAttached)
            {
                Console.Read();
            }
            return 0;
        }

        private static bool IsValidFileForEnvironment(string file, string env)
        {
            string[] environments = { "dev", "prod", "test", "local", "acc" };
            if (!environments.Contains(env))
            {
                throw new ArgumentException($"The environment variable '{env}' is not valid. Valid values:'{string.Join(',', environments)}'.");
            }

            string[] environmentsIgnore = environments.Except(new[] { env }).ToArray();

            foreach (var environment in environmentsIgnore)
            {
                string filter = string.Format(CultureInfo.InvariantCulture, ".{0}.sql", environment);

                if (file.EndsWith(filter, StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool IsValidVersion(string file, Version initialVersion)
        {
            string versionRegex = @".*\.V([0-9]+)\._([0-9]+)\._([0-9]+)\..*\.sql";

            Match match = Regex.Match(file, versionRegex, RegexOptions.IgnoreCase);
            var major = int.Parse(match.Groups[1].Value);
            var minor = int.Parse(match.Groups[2].Value);
            var build = int.Parse(match.Groups[3].Value);
            var version = new Version(major, minor, build);

            return version >= initialVersion;
        }
    }
}
