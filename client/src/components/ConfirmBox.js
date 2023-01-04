import React from 'react';

export function ConfirmBox(props) {

    const callback = props.data.callback;
    const closeConfirmBox = props.data.closeConfirmBox;
    const title = props.data.title;
    const message = props.data.message;

    function onYes () {
        callback();
    }

    function onNo() {
        closeConfirmBox();
    }

    return (
        <div className="ConfirmBoxContainer">
            <div className="confirmBox">
                <div className="title">
                    {title}
                </div>

                <div className="message">
                    {message}
                </div>

                <nav className="options">
                    <button className="yes" onClick={onYes}>Delete</button>
                    <button className="no" onClick={onNo}>Cancel</button>
                </nav>
            </div>
        </div>
    );
}