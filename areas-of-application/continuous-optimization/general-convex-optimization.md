# General convex optimization

## Overview

A convex problem asks to optimize a convex function $f$ over a convex set $K$, where $K$ is a subset of $\mathbb{R}^n$. Here we examine the situation where the value of $f(x)$ and the membership of $x$ in the set $K$ can each be efficiently computed classically. However, we do not exploit/assume any additional structure that may be present in $f$ or $K$. This situation contrasts with that of [solving conic programs](../../areas-of-application/continuous-optimization/conic-programming-solving-lps-socps-and-sdps.md#conic-programming-solving-lps-socps-and-sdps), where $f$ is linear and $K$ is an intersection of convex cones and affine spaces, features that can be exploited to yield more efficient classical and quantum algorithms.


A so-called "zeroth-order" solution to this problem solves it simply by adaptively evaluating $f(x)$ and $x \in K$ for different values of $x$. For the zeroth-order approach, a quantum algorithm can obtain a quadratic speedup with respect to the number of times these functions are evaluated, reducing it from $\tilde{\mathcal{O}}(n^2)$ to $\tilde{\mathcal{O}}(n)$, where $\tilde{\mathcal{O}}$ notation hides factors polylogarithmic in $n$ and other parameters. This could lead to a practical speedup only if the cost to evaluate $f(x)$ and $x\in K$ is large, and lack of structure rules out other, possibly faster, approaches to solving the problem.


## Actual end-to-end problem(s) solved

Suppose we have classical algorithms $\mathcal{A}_f$ for computing $f(x)$ and $\mathcal{A}_K$ for computing $x \in K$ ("membership oracle"), which require $C_f$ and $C_K$ gates to perform with a reversible classical circuit, respectively. Suppose further we have an initial point $x_0 \in K$ and that we have two numbers $r$ and $R$ for which we know that $B(x_0,r) \subset K \subset B(x_0,R)$, where $B(y,t) = \{z \in \mathbb{R}^n: \lVert z-y \rVert \leq t\}$ denotes the ball of radius $t$ centered at $y$. Using $\mathcal{A}_f$, $\mathcal{A}_K$, $x_0$, $r$, $R$, and $\epsilon$ as input, the output is a point $\tilde{x}$ that is $\epsilon$-optimal, that is, it satisfies $$\begin{equation} f(\tilde{x}) \leq \min_{x \in K}f(x) + \epsilon\,. \end{equation}$$


## Dominant resource cost/complexity

The work of [@chakrabarti2018QuantumConvexOpt] and [@apeldoorn2018ConvexOptUsingQuantumOracles] independently establish that there is a quantum algorithm that solves this problem with gate complexity upper bounded by $$\begin{equation} \left[(C_f + C_K)n +n^3\right]\cdot \text{polylog}(nR/r\epsilon)\,, \end{equation}$$ where the polylogarithmic factors were left unspecified. The rough idea behind the algorithm is to leverage the [quantum gradient estimation](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation) algorithm to implement a *separation oracle*—a routine that determines membership $x\in K$ and when $x \not\in K$ outputs a hyperplane separating $x$ from all points in $K$—using only $\mathcal{O}\left( 1 \right)$ queries to algorithm $\mathcal{A}_K$ and $\mathcal{A}_f$. It had been previously established that $\tilde{\mathcal{O}}(n)$ queries to a separation oracle then suffice to perform optimization [@lee2015FasterCuttingPlaneConvexOpt], where $\tilde{\mathcal{O}}$ denotes that logarithmic factors have been suppressed.


## Existing error corrected resource estimates

There have not been any such resource estimates for this algorithm. It may not make sense to perform such an estimate without a more concrete scenario in mind, as the estimate would highly depend on the complexity of performing the circuits for $\mathcal{A}_f$ and $\mathcal{A}_K$.


## Caveats

One caveat is that the quantum algorithm must coherently perform reversible implementations of the classical functions that compute $f(x)$ and $x \in K$. Compared to a nonreversible classical implementation, this may cost additional ancilla qubits and gates. Another caveat relates to the scenario where $f(x)$ and $x\in K$ are determined by classical data stored in a classical database. Such a situation may appear to be an appealing place to look for applications of this algorithm because when $f$ and $K$ are determined empirically rather than analytically, it becomes easier to argue that there is no structure that can be exploited. However, in such a situation, implementing $\mathcal{A}_f$ and $\mathcal{A}_K$ would require a large gate complexity $C_f$ and $C_K$ scaling with the size of the classical database. It would almost certainly be the case that a [quantum random access memory](../../quantum-algorithmic-primitives/loading-classical-data/quantum-random-access-memory.md#quantum-random-access-memory) (QRAM) admitting log-depth queries would be needed in order for the algorithm to remain competitive with classical implementations that have access to classical RAM, and the practical feasibility of building a large-scale log-depth QRAM has many additional caveats.


Another caveat is that there may not be many practical situations that are compatible with a quantum speedup by this algorithm. The source of the speedup in [@chakrabarti2018QuantumConvexOpt; @apeldoorn2018ConvexOptUsingQuantumOracles] comes from a separation between the complexity of computing the gradient of $f$ classically vs. quantumly using calls to the function $f$. Classically, this requires at least linear-in-$n$ number of calls. Quantumly, it can be done in $\mathcal{O}\left( 1 \right)$ calls using the quantum algorithm for [gradient estimation](../../quantum-algorithmic-primitives/quantum-gradient-estimation.md#quantum-gradient-estimation). In both the classical and the quantum case, the gradient can subsequently be used to construct a "separation" oracle for the set $K$, which is then used to solve the convex problem.


Thus, a speedup is only possible if there is no obvious way to classically compute the gradient of $f$ other than to evaluate $f$ at many points. This criterion is violated in many practical situations, which are often said to obey a "cheap gradient principle" [@griewank2008EvalDerivatives; @bolte2022nonsmooth] that asserts that the gradient of $f$ can be computed in time comparable to the time required to evaluate $f$. For example, the fact that gradients are cheap is crucial for training modern machine learning models with a large number of parameters. When this is the case, the algorithms from [@chakrabarti2018QuantumConvexOpt; @apeldoorn2018ConvexOptUsingQuantumOracles] do not offer a speedup. On the other hand, as observed in [@apeldoorn2018ConvexOptUsingQuantumOracles Footnote 19] a nontrivial example of a problem where the cheap gradient principle may fail (enabling a possible advantage for these quantum algorithms) is the moment polytope problem, which has connections to quantum information [@burgisser2018EffTensorScalingMomentPolytopes].


When both the function $f$ and the gradient of $f$ can be evaluated at unit cost, this constitutes "first-order" optimization, which can be solved by gradient descent. However, gradient descent does not generally offer a quantum speedup, as general quantum lower bounds match classical upper bounds [@garg2020noSpeedupGradDescent], although a quantum speedup could exist in specific cases.


## Comparable classical complexity

The best classical algorithm [@lee2017ConvexOptWMemb] in the same setting has complexity $$\begin{equation} \left[(C'_f + C'_K)n^2 +n^3\right]\cdot \text{polylog}(nR/r\epsilon)\,, \end{equation}$$ where $C_f'$ and $C'_K$ denote the classical complexity of evaluating $f$ and querying membership in $K$, respectively, without the restriction that the circuit be reversible.


## Speedup

The speedup is greatest when quantities $C_f$ and $C_K$ are large compared to $n$ and roughly equal to $C'_f$ and $C'_K$. In this case, the quantum algorithm can provide an $\mathcal{O}\left( n \right)$ speedup, which is at best a polynomial speedup. The maximal power of the polynomial would be obtained if $C_f+C_K\approx C'_f+C'_K$ scales as $n^2$, corresponding to a subquadratic speedup from $\mathcal{O}\left( n^4 \right)$ to $\mathcal{O}\left( n^3 \right)$.


## Outlook

The only analyses of this strategy are theoretical in nature, interested more so in the query complexity of solving this problem than any specific applications it might have. As such, the analysis is not sufficiently fine-grained to determine any impact from constant factors or logarithmic factors. While a quadratic speedup in query complexity is possible, the maximal speedup in gate complexity is smaller than quadratic. Moreover, there is a lack of concrete problems that fit into the paradigm of "structureless" quantum convex optimization. Together, these factors make it unlikely that a practical quantum advantage can be found in this instance. 





