FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY SistemaCandeyInventario.slnx ./
COPY SistemaCandeyInventario.Domain/SistemaCandeyInventario.Domain.csproj SistemaCandeyInventario.Domain/
COPY SistemaCandeyInventario.Application/SistemaCandeyInventario.Application.csproj SistemaCandeyInventario.Application/
COPY SistemaCandeyInventario.Infrastructure/SistemaCandeyInventario.Infrastructure.csproj SistemaCandeyInventario.Infrastructure/
COPY SistemaCandeyInventario.API/SistemaCandeyInventario.API.csproj SistemaCandeyInventario.API/

RUN dotnet restore SistemaCandeyInventario.API/SistemaCandeyInventario.API.csproj

COPY . .
RUN dotnet publish SistemaCandeyInventario.API/SistemaCandeyInventario.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SistemaCandeyInventario.API.dll"]
