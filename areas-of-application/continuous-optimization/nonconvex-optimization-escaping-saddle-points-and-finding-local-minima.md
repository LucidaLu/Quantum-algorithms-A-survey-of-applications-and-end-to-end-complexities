# Nonconvex optimization: Escaping saddle points and finding local minima

## Overview

Finding the global minimum of nonconvex optimization problems is challenging because local algorithms get stuck in local minima. Often, there are many local minima and they are each separated by large energy barriers. Accordingly, instead of finding the global minimum, one may settle for finding a local minimum: local minima can often still be used effectively in situations such as training machine learning models. An effective approach to finding a local minimum is gradient descent, but gradient descent can run into the problem of getting stuck near saddle points, which are not local minima but nonetheless have a vanishing gradient. Efficiently finding local minima thus requires methods for escaping saddle points. Limited work in this area suggests a potential polynomial quantum speedup [@zhang2021escapingSaddlePoints] in the dimension dependence for finding local minima, using subroutines for [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) and [quantum gradient estimation](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation).


## Actual end-to-end problem(s) solved

Suppose we have a classical algorithm $\mathcal{A}_f$ for (approximately) computing a function $f: \mathbb{R}^n \rightarrow \mathbb{R}$ which requires $C_f$ gates to perform with a reversible classical circuit. The amount of error tolerable is specified later. Following [@zhang2021escapingSaddlePoints], suppose further that $f$ is $\ell$-smooth and $\rho$-Hessian Lipschitz, that is $$\begin{align} \lVert \nabla f(x_1) - \nabla f(x_2) \rVert & \leq \ell \lVert x_1 - x_2 \rVert \qquad \forall x_1, x_2 \in \mathbb{R}^n \\
\lVert \nabla^2 f(x_1) - \nabla^2 f(x_2) \rVert & \leq \rho \lVert x_1 - x_2 \rVert \qquad \forall x_1, x_2 \in \mathbb{R}^n \,, \end{align}$$ where $\nabla f$ denotes the gradient of $f$ (a vector), $\nabla^2 f$ denotes the Hessian of $f$ (a matrix), and $\lVert \cdot \rVert$ denotes the standard Euclidean norm for vector arguments, and the spectral norm for matrix arguments.


The end-to-end problem solved is to take as input a specification of the function $f$, an initial point $x_0$, and an error parameter $\epsilon$, and to output an $\epsilon$-approximate second-order stationary point (i.e. approximate local minimum) $x$, defined as satisfying $$\begin{align} \lVert \nabla f(x) \rVert \leq \epsilon \qquad \qquad \lambda_{\min}(\nabla^2 f(x)) \geq -\sqrt{\rho \epsilon}\,, \end{align}$$ where $\lambda_{\min}(\cdot)$ denotes the minimum eigenvalue of its argument. In other words, the gradient should be nearly zero, and the Hessian should be close to a positive-semidefinite matrix.


## Dominant resource cost/complexity

Reference [@zhang2021escapingSaddlePoints] gives a quantum algorithm that performs the $C_f$-gate quantum circuit for coherently computing $f$ a number of times scaling as $$\begin{equation} \tilde{\mathcal{O}}\left(\frac{\log(n)(f(x_0)-f^*)}{\epsilon^{1.75}}\right) \end{equation}$$ where $x_0$ is the initial point and $f^*$ is the global minimum of $f$. The evaluation of $f$ must be correct up to precision $\mathcal{O}\left( \epsilon^2/n^4 \right)$. Note that the work of [@zhang2021escapingSaddlePoints] initially showed a $\log^2(n)$ dependence, which was later improved to $\log(n)$ using the improved simulation method of [@childs2022quantumsimulationof]. Any additional gate overhead is not quoted in [@zhang2021escapingSaddlePoints].


The idea is to run normal gradient descent, which has gradient query cost independent of $n$, until reaching an approximate saddle point. Classical algorithms typically apply random perturbations to detect a direction of negative curvature and continue the gradient descent. Instead, the quantum algorithm constructs a Gaussian wavepacket localized at the saddle point, and evolves according to the Schrödinger equation $$\begin{equation} \label{eq:nonconvex_Ham} i\frac{\partial}{\partial t}\Phi = \left(-\frac{1}{2}\Delta + f(x)\right)\Phi\,, \end{equation}$$ where $\Delta$ denotes the Laplacian operator. The intuition is that, in the directions of positive curvature, the particle stays localized (as in a harmonic potential), while in the directions of negative curvature, the particle quickly disperses. Thus, when the position of the particle is measured, it is likely to have escaped the saddle point in a direction of negative curvature, and gradient descent can be continued. The other technical ingredient is the [quantum gradient estimation algorithm](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation), which uses a constant number of (coherent) queries to the function $f$ to estimate $\nabla f$.


A similar approach was taken in [@gong2022robustnessNonconvex] for analyzing the complexity of escaping a saddle point when one has access to *noisy* queries to the value of the function $f$. Additionally, lower bounds on the $\epsilon$-dependence of quantum algorithms for this problem are given in [@zhang2022lowerBoundsNonconvex].


## Existing error corrected resource estimates

This problem has received relatively little attention, and no resource estimates have been performed.


## Caveats

Reference [@zhang2021escapingSaddlePoints] gives the query complexity of the quantum algorithm but does not perform a full end-to-end resource analysis. (However, it does numerically study the performance of the quantum algorithm in a couple of toy examples.) Additionally, many practical scenarios are said to obey a "cheap gradient principle" [@griewank2008EvalDerivatives; @bolte2022nonsmooth], which says that computing the gradient is almost as easy as computing the function itself, and in these scenarios, no significant quantum speedup is available. Finally, in the setting of [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms), this does not avoid the issue of barren plateaus, which refers to the situation where a large portion of the parameter space has a gradient (and Hessian) that vanishes exponentially with $n$. These regions would be characterized as $\epsilon$-approximate local minima unless $\epsilon$ is made exponentially small in $n$.


## Comparable classical complexity and challenging instance sizes

The best classical algorithm [@zhang2021classicalEscapeSaddlePoints] for this problem makes $$\begin{equation} \tilde{\mathcal{O}}\left(\frac{\log(n)(f(x_0)-f^*)}{\epsilon^{1.75}}\right) \end{equation}$$ queries to the *gradient* of $f$. Note that $\text{poly}(n)$ queries to the value of $f$ would be needed to construct a query to the gradient. (When the quantum algorithm in [@zhang2021escapingSaddlePoints] was first discovered, the best classical algorithm required $\mathcal{O}\left( \log(n)^6 \right)$ gradient queries [@jin2018EscapesSaddlePoints Theorem 3], and this was later improved.)


## Speedup

The quantum algorithm in [@zhang2021escapingSaddlePoints] has the same query complexity as the classical algorithm in [@zhang2021classicalEscapeSaddlePoints]; the difference is that the quantum algorithm makes (coherent) queries to an evaluation oracle, while the classical algorithm requires access to a gradient oracle. Thus, if classical gradient queries are available, there is no speedup, and if no gradient query is available, the speedup can be exponential.


## Outlook

It is unclear whether the algorithm for finding local minima could lead to a practical speedup, as it depends highly on the (non)availability of an efficient classical procedure for implementing gradient oracles; a quantum speedup is possible only when such oracles are difficult to implement classically. However, the algorithm represents a useful end-to-end problem where the [quantum gradient estimation](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation) primitive can be applied. It is also notable that the quantum algorithm employs [Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation), a primitive not used in most other approaches to continuous optimization. Relatedly, [@leng2023quantumHamiltonianDescent] proposes a quantum subroutine called "quantum Hamiltonian descent" which is a genuinely quantum counterpart to classical gradient descent, via Hamiltonian simulation of an equation similar to Eq. $\eqref{eq:nonconvex_Ham}$. Unlike classical gradient descent, it can exploit quantum tunneling to avoid getting stuck in local minima; thus, it can potentially find *global* minima of nonconvex functions. Establishing concrete end-to-end problems where quantum approaches based on Hamiltonian simulation yield an advantage in nonconvex optimization is an interesting direction for future work. 





