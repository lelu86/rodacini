#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0-preview AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-preview AS build
# Install NodeJs
RUN apt-get update && \
apt-get install -y wget && \
apt-get install -y gnupg2 && \
wget -qO- https://deb.nodesource.com/setup_20.x | bash - && \
apt-get install -y build-essential nodejs
# End Install
WORKDIR /src
COPY ["rodacini.csproj", "."]
RUN dotnet restore "./rodacini.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "rodacini.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "rodacini.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "rodacini.dll"]