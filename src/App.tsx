import { Routes, Route } from "react-router";
import { useEffect } from "react";

import Login from "./views/Login";
import Register from "./views/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "./views/Dashboard";
import Server from "./views/Server";
import Friends from "./views/Friends";
import DirectMessages from "./views/DirectMessages";
import useAuth from "./hooks/useAuth";
import { useBoundStore } from "./stores/useBoundStore";
import NoSelectedChannel from "./components/NoSelectedChannel";
import NoSelectedServer from "./components/NoSelectedServer";
import TextChannel from "./components/TextChannel";
import DMLayout from "./components/DMLayout";

const App = () => {
    const { initializeAuth } = useAuth();
    const authenticatedUser = useBoundStore((state) => state.authenticatedUser);

    useEffect(() => {
        if (authenticatedUser) return;

        initializeAuth();
    }, [authenticatedUser, initializeAuth]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />}>
                    <Route path="/" element={<NoSelectedServer />} />
                    <Route path="channels/@me" element={<DMLayout />}>
                        <Route index element={<Friends />} />
                        <Route path=":userId" element={<DirectMessages />} />
                    </Route>
                    <Route path="channels/:serverId" element={<Server />}>
                        <Route index element={<NoSelectedChannel />} />
                        <Route path=":channelId" element={<TextChannel />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
