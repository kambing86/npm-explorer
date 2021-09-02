const Header: React.FC = ({ children }) => <>{children}</>;

const Body: React.FC = ({ children }) => <>{children}</>;

const Footer: React.FC = ({ children }) => <>{children}</>;

type Node = React.ReactElement<{ children: React.ReactNode }>;

const DefaultLayout = ({ children }: { children: Node | Node[] }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const header = childrenArray.find((el) => el.type === Header);
  const body = childrenArray.find((el) => el.type === Body);
  const footer = childrenArray.find((el) => el.type === Footer);

  return (
    <div className="container">
      <header>{header}</header>
      <main>{body}</main>
      <footer>{footer}</footer>
    </div>
  );
};

DefaultLayout.Header = Header;
DefaultLayout.Body = Body;
DefaultLayout.Footer = Footer;

export default DefaultLayout;
