import re

with open('frontend/src/components/Header.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
"""
content = re.sub(r'(import React, { useState } from '"'"'react'"'"';)', r'\1\n' + imports, content)

# Add hooks inside component
hooks = """  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: res.access_token }),
        });
        if (response.ok) {
          const data = await response.json();
          setAuth(data.user, data.token);
          if (!data.user.profileCompleted) navigate('/setup-profile');
        }
      } catch (e) { console.error(e); }
    }
  });
"""
content = re.sub(r'(const \[hoveredNav, setHoveredNav\] = useState<string \| null>\(null\);)', r'\1\n' + hooks, content)

# Modify avatar button logic
# We need to replace the entire <motion.button id="header-profile-avatar-btn"...> block
# It's easier to just find the `Profile Avatar Button` comment and replace that block
profile_block = """          {/* Authentication & Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <img src={user?.picture || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-xl cursor-pointer" onClick={onOpenProfile} />
              <button onClick={() => logout()} className="text-sm font-medium text-red-600">Logout</button>
            </div>
          ) : (
            <button onClick={() => googleLogin()} className="px-4 py-2 bg-[#DE6828] text-white rounded-xl font-medium shadow-md">Sign In</button>
          )}"""

content = re.sub(r'\{\/\* Profile Avatar Button \*\/\}.*?(?=\<\/div\>\n      \<\/div\>\n    \<\/header\>)', profile_block + '\n        ', content, flags=re.DOTALL)

with open('frontend/src/components/Header.tsx', 'w') as f:
    f.write(content)
