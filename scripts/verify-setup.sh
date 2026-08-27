#!/bin/bash
# Midnight Toolchain Verification Script
# Run this to verify your setup is correct

echo "🌙 Midnight Toolchain Verification"
echo "=================================="
echo ""

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js: $NODE_VERSION"
    if [[ "$NODE_VERSION" == v22* ]]; then
        echo "   ✅ Version 22+ confirmed"
    else
        echo "   ⚠️  Version 22+ recommended (current: $NODE_VERSION)"
    fi
else
    echo "   ❌ Node.js not found"
fi

# Check Docker
echo ""
echo "2. Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    echo "   ✅ Docker: $DOCKER_VERSION"
    if docker compose version &> /dev/null; then
        COMPOSE_VERSION=$(docker compose version | cut -d' ' -f4)
        echo "   ✅ Docker Compose v2: $COMPOSE_VERSION"
    else
        echo "   ❌ Docker Compose v2 not found"
    fi
else
    echo "   ❌ Docker not found"
fi

# Check Compact compiler
echo ""
echo "3. Checking Compact compiler..."
if command -v compact &> /dev/null; then
    COMPACT_VERSION=$(compact --version 2>/dev/null || echo "unknown")
    COMPILER_VERSION=$(compact compile --version 2>/dev/null || echo "unknown")
    echo "   ✅ Compact CLI: $COMPACT_VERSION"
    echo "   ✅ Compiler: $COMPILER_VERSION"
else
    echo "   ❌ Compact compiler not found"
    echo "   Install with:"
    echo "   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh"
fi

# Check contract compilation
echo ""
echo "4. Checking contract compilation..."
if [ -f "contracts/managed/hello-world/contract/index.js" ]; then
    echo "   ✅ Contract compiled"
    echo "   📁 Output: contracts/managed/hello-world/"
    ls -la contracts/managed/hello-world/ 2>/dev/null | head -5
else
    echo "   ❌ Contract not compiled"
    echo "   Run: cd contracts && compact compile hello-world.compact managed/hello-world"
fi

echo ""
echo "=================================="
echo "Verification complete!"
