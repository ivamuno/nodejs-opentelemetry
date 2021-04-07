FROM microsoft/dotnet:2.2-runtime AS base

RUN mkdir -p /app && \
groupadd -r app && \
useradd --uid 101 -r -g app -d /app -s /sbin/nologin -c "Docker image user" app

FROM microsoft/dotnet:2.2-sdk AS publish
WORKDIR /src
COPY . .
RUN ls -R
RUN dotnet publish "Database.csproj" -c Release -o /app

FROM base AS final

RUN apt-get update
RUN apt-get install -y telnet dos2unix

WORKDIR /app
COPY --from=publish /app .
COPY ./wait-for-db.sh .
RUN dos2unix ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh
RUN chown app:app /app -R

USER 101
ENTRYPOINT ["sh"]
CMD  ["./wait-for-db.sh" ,"dotnet", "Database.dll"]
