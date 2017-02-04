import * as React from 'react';

interface Props {
    title?: string;
}

export default class DefaultLayout extends React.Component<Props, {}> {
    render() {
        return (
            <html>
                <head><title>{this.props.title}</title></head>
                <body>
                    {this.props.children}
                </body>
            </html>
        );
    }
}